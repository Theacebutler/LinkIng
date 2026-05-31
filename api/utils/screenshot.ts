import puppeteer from "puppeteer";
import { db } from "../db";
import { screenshotsTable } from "../db/schema";
import formatMemoryUsage from "./formatMemoryUsage";

export default async function screenshot(url: string | null | undefined, resourceId: number | undefined): Promise<void> {
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
    } catch (e) {
      console.error({
        Error: e,
        Memory: formatMemoryUsage(),
        resourceId: resourceId,
      })
    }
  } finally {
    await browser.close()
  }
}
