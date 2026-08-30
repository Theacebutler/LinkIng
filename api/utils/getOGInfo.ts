import * as cheerio from 'cheerio';
import logger from './logger';
interface OGimage {
  imageData?: string | void
  title?: string
  description?: string
  width?: number,
  height?: number,
}

export default async function getOGinfo(resourceUrl: string): Promise<OGimage> {
  const res = await fetch(resourceUrl).then((d) => d.text())
  const doc = cheerio.load(res)
  const imageUrl = doc('meta[property="og:image"]').attr('content') || doc('meta[name="twitter:image"]').attr('content')
  const title = doc('meta[property="og:title"]').attr('content') || doc('meta[name="twitter:title"]').attr('content')
  const height = doc('meta[property="og:image:height"]').attr('content') || doc('meta[name="twitter:image:height"]').attr('content')
  const width = doc('meta[property="og:image:width"]').attr('content') || doc('meta[name="twitter:image:width"]').attr('content')
  // TODO: description is not being used yet
  const description = doc('meta[property="og:description"]').attr('content') || doc('meta[name="twitter:description"]').attr('content')
  if (imageUrl) {
    const imageData = await fetch(imageUrl as string)
      .then(async (res) => {
        if (!res.ok) throw new Error("Image fetch failed")
        const buff = await res.arrayBuffer()
        return Buffer.from(buff).toString('base64')
      })
      .catch(logger.error)
    return {
      imageData,
      height: Number(height) || 1820,
      width: Number(width) || 720,
      title,
      description
    }
  }
  return {
    title,
    description
  }
}
