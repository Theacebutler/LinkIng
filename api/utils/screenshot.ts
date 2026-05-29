import * as genericPool from "generic-pool"
import puppeteer, { type Browser } from "puppeteer";
import { db } from "../db";
import { screenshotsTable } from "../db/schema";


const factory = {
  create: async () => {
    return await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    });
  },
  destroy: async (browser: Browser) => {
    await browser.close()
  },
  validate: async (browser: Browser) => {
    try {
      await browser.pages()
      return true
    } catch {
      return false
    }
  }
}

const pool = genericPool.createPool(factory, {
  min: 2,
  max: 5,
  testOnBorrow: false,
  evictionRunIntervalMillis: 60000

})

export default async function screenshot(url: string | null | undefined, resourceId: number | undefined): Promise<void> {
  if (!url || !resourceId) return
  const browser = await pool.acquire()
  try {
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
    } catch (e) {
      console.log(e)
    }
    await page.close()
    await db.insert(screenshotsTable).values({
      resourceId,
      image
    })
  } finally {
    await pool.release(browser)
  }
}
