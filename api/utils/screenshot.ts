import puppeteer from "puppeteer";
import { db } from "../db";
import { screenshotsTable } from "../db/schema";
import formatMemoryUsage from "./formatMemoryUsage";

type ScreenshotJob = { timeAdded?: number, url: string, resourceId: number, isDone: boolean }
const screenshotQ: ScreenshotJob[] = []
let PROCESSING: boolean = false
let PROCESSING = false

export default function addToScreenshotQ(url: string | null | undefined, resourceId: number | undefined) {
  if (!url || !resourceId) return
  const newJob: ScreenshotJob = {
    url,
    resourceId,
    isDone: false,
    timeAdded: Date.now()
  }
  screenshotQ.push(newJob)
  if (!PROCESSING) handleNextScreenshot()
}

async function handleNextScreenshot() {
  if (screenshotStack.length <= 0) {
    PROCESSING = false
    return
  }
  PROCESSING = true
  const curr = screenshotStack.pop()
  if (!curr) return
  try {
    await screenshot(curr.url, curr.resourceId)
  } catch (e) {
    console.error({
      Error: e,
      Memory: formatMemoryUsage(),
      resourceId: curr.resourceId,
      url: curr.url,
      age: curr.timeAdded
    })
  }
  handleNextScreenshot()
}
async function screenshot(url: string, resourceId: number): Promise<void> {
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

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1820, height: 720 })
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
    } finally {
      await page.close()
    }
  } finally {
    await browser.close()
  }
}
