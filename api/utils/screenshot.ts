import puppeteer from "puppeteer";
import { db } from "../db";
import { screenshotsTable } from "../db/schema";
import formatMemoryUsage from "./formatMemoryUsage";

type ScreenshotJob = { timeAdded: number, url: string, resourceId: number, isDone: boolean, timesTried: number }
const screenshotStack: ScreenshotJob[] = []
let PROCESSING: boolean = false
let BROWSER: Browser | null = null

export default function addToScreenshotStack(url: string | null | undefined, resourceId: number | undefined, timesTried: number = 0) {
  if (!url || !resourceId) return
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      '--max-old-space-size=512', // Limits V8 memory in MB
      '--memory-pressure-off', // Prevents browser from aggressively trying to swap
      "--single-process",    // reduces total processes
      "--no-zygote",         // prevents extra process fork
    ]
  });

async function handleNextScreenshot() {
  PROCESSING = true
  while (PROCESSING) {
    if (screenshotStack.length <= 0) {
      PROCESSING = false
      return
    }
    const curr = screenshotStack.shift()
    if (!curr) return
    if (curr.timesTried > config.MAX_SCREENSHOT_TRIES) {
      console.error({
        message: "screenshot failed too many times",
        limit: config.MAX_SCREENSHOT_TRIES,
        resourceId: curr.resourceId,
        url: curr.url,
        age: Math.floor((Date.now() - curr.timeAdded) / 60_000)
      })
      return
    }
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded' })
      if (res?.ok()) {
        const image = await page.screenshot({
          type: 'png',
          encoding: 'base64',
          fullPage: false
        })
        await db.insert(screenshotsTable).values({
          resourceId,
          image
        })
      }
    } catch (e) {
      console.error({
        Error: e,
        Memory: formatMemoryUsage(),
        resourceId: curr.resourceId,
        url: curr.url,
        age: Math.floor((Date.now() - curr.timeAdded) / 60_000)
      })
    }
  }
}
async function getBrowser() {
  if (!BROWSER || !BROWSER.connected) {
    BROWSER = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        // "--disable-gpu",
        '--max-old-space-size=512', // Limits V8 memory in MB
        '--memory-pressure-off', // Prevents browser from aggressively trying to swap
        // "--single-process",    // reduces total processes
        "--no-zygote",         // prevents extra process fork
      ]
    });
  }
  return BROWSER
}


async function screenshot(url: string, resourceId: number): Promise<void> {
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.setViewport({ width: 1820, height: 720 })
  let image: string | null = null
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded' })
    if (res?.ok()) {
      image = await page.screenshot({
        type: 'png',
        encoding: 'base64',
        fullPage: false
      })
    }
  } finally {
    await browser.close()
  }
  await db.insert(screenshotsTable)
    .values({
      resourceId,
      image,
      hasImage: image ? 1 : 0,
    })
}
