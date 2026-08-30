import { fetchWithAuth } from "./authClient";

// fetch the screenshot url and get the base64 image
export default async function getBase64String(url: string): Promise<string | null> {
  function toBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  try {
    const res = await fetchWithAuth(url)
    const buff = await res.arrayBuffer()
    const str = toBase64(new Uint8Array(buff))
    return str
  } catch (_err) {
    console.error(_err);

    return null
  }
}
