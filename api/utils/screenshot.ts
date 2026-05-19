import * as genericPool from "generic-pool"
import puppeteer, { type Browser } from "puppeteer";
import { db } from "../db";
import { screenshotsTable } from "../db/schema";


let screenshot_count = 0
const MAX_SCREENSHOT_COUNT = 100

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
      browser.pages()
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
  const browser = await pool.acquire();
  try {
    screenshot_count++
    if (screenshot_count >= MAX_SCREENSHOT_COUNT) {
      await pool.destroy(browser);
      screenshot_count = 0
      return await screenshot(url, resourceId)
    }
  } finally {
    await pool.release(browser);
  }

  const page = await browser.newPage()
    .then((page) => {
      page.setViewport({ width: 1820, height: 720 });
      return page;
    });
  let image: string | null = null
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle2' });
    if (res?.ok()) {
      image = await page.screenshot({
        type: 'png',
        encoding: 'base64',
        fullPage: false
      });
    } else {
      image = null
    };
  } catch (e) {
    console.log(e)
  }
  await db.insert(screenshotsTable).values({
    resourceId: resourceId,
    image: image
  })
};
