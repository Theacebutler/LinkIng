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
  PROCESSING = true
  while (PROCESSING) {
    if (screenshotQ.length <= 0) {
      PROCESSING = false
      return
    }
    const curr = screenshotQ.shift()
    if (!curr) return
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
