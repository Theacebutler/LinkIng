import puppeteer from "puppeteer";



async function screenshot(url: string | null | undefined): Promise<string | undefined> {
  if (!url) return
  const b = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await b.newPage();

  await page.setViewport({ width: 1820, height: 720 });
  await page.goto(url, { waitUntil: 'networkidle2' });


  const image = await page.screenshot({
    type: 'png',
    encoding: 'base64',
    fullPage: false
  });
  await b.close();
  return image;
};

export default screenshot;


