
export function getImage(url: string): string | null {
  const image = localStorage.getItem(url)
  return image
}
