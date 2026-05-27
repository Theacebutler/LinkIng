import { useEffect, useState } from "react";
import type { Resource } from "../types/resource";
import { config } from "../../config";
import { fetchWithAuth } from "../utils/authClient";

const VITE_API_URL = config.VITE_API_URL

export default function ResourceImage({ resource }: { resource: Resource }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeOutID: ReturnType<typeof setTimeout>

    async function poll(attempt: number) {
      if (cancelled) return
      const url = `${VITE_API_URL}/resources/screenshots/${resource.id}`
      const data = await fetchWithAuth(url)
      if (data.ok) {
        setImageUrl(url)
        setLoaded(true)
        setError(false)
      } else if (attempt >= config.MAX_IMAGE_POLLING_ATTEMPTS) {
        setError(true)
        return
      } else {
        timeOutID = setTimeout(() => poll(attempt + 1), 4000 + (attempt * 1000))
      }
    }
    poll(1)
    return () => {
      cancelled = true
      clearTimeout(timeOutID)
    }
  }, [resource.id])


  return (
    <div className="mt-3">
      {
        loaded ? <img
          src={imageUrl}
          alt="Source preview"
          className="w-full border border-slate-600 rounded bg-white"
        /> : error ?
          <div className="w-full h-full align-middle rounded">Error loading preview</div>
          : <div className="w-full h-full align-middle rounded animate-pulse">Loading preview...</div>
      }
    </div>
  );
}
