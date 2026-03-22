import puppeteer from "puppeteer";
import { db } from "../db";
import { screenshotsTable } from "../db/schema";


export async function screenshot(url: string | null | undefined, resourceId: string | undefined): Promise<string | undefined> {
  if (!url || !resourceId) return
  console.log("screenshot", url, resourceId)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1820, height: 720 });
  await page.goto(url, { waitUntil: 'networkidle2' });


  const image = await page.screenshot({
    type: 'png',
    encoding: 'base64',
    fullPage: false
  });
  await browser.close();

  await db.insert(screenshotsTable).values({
    id: crypto.randomUUID(),
    resourceId: resourceId,
    image: image
  })
  return image
};

export default screenshot;


