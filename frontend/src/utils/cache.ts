/* take in an image as a base64 encoded string and save it to local storage */
export async function cacheImage(url: string, data: string) {
  localStorage.setItem(url, data)
}

export function getImage(url: string): string | null {
  const image = localStorage.getItem(url)
  return image
}
