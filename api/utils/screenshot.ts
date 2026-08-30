import { db } from "../db";
import { config } from "../config";
import { screenshotsTable } from "../db/schema";
import formatMemoryUsage, { highCPUload } from "./formatMemoryUsage";
import handleFaildScreenshots from "./screenshotsRetry";
import logger from "./logger";

export type ScreenshotJob = { timeAdded: number, url: string, resourceId: number, isDone: boolean, timesTried: number }
export const screenshotStack: ScreenshotJob[] = []
let PROCESSING: boolean = false

export default function addToScreenshotStack(url: string | null | undefined, resourceId: number | undefined, timesTried: number = 0) {
  if (!url || !resourceId) return
  const newJob: ScreenshotJob = {
    url,
    resourceId,
    isDone: false,
    timeAdded: Date.now(),
    timesTried: timesTried
  }
  screenshotStack.push(newJob)
  if (!PROCESSING) handleNextScreenshot()
}

async function handleNextScreenshot() {
  PROCESSING = true
  while (PROCESSING) {
    if (screenshotStack.length <= 0) {
      PROCESSING = false
      if (highCPUload()) return
      handleFaildScreenshots()
      return
    }
    const curr = screenshotStack.shift()
    if (!curr) return
    if (curr.timesTried > config.MAX_SCREENSHOT_TRIES) {
      logger.error({
        message: "screenshot failed too many times",
        limit: config.MAX_SCREENSHOT_TRIES,
        resourceId: curr.resourceId,
        url: curr.url,
        age: new Date(curr.timeAdded)
      })
      return
    }
    try {
      await screenshot(curr.url, curr.resourceId)
    } catch (e) {
      // re-add to stack if it fails
      addToScreenshotStack(curr.url, curr.resourceId, curr.timesTried + 1)
      logger.error({
        Error: e,
        Memory: formatMemoryUsage(),
        resourceId: curr.resourceId,
        url: curr.url,
        age: new Date(curr.timeAdded)
      })
    }
  }
}


async function screenshot(url: string, resourceId: number): Promise<void> {
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.setViewport({ width: 1820, height: 720 })
  let image: string | null = null
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle0' })
    if (res?.ok()) {
      image = await page.screenshot({
        type: 'png',
        encoding: 'base64',
        fullPage: false
      })
    }
  } catch (e) {
    logger.error(e)
    throw e
  } finally {
    await page.close()
  }
  await db.insert(screenshotsTable).values({
    resourceId,
    image,
    hasImage: image ? 0 : 1,
    methodUsed: "puppeteer"
  })
} 
