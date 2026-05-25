import { useEffect, useState } from "react";
import type { Resource } from "../types/resource";
import { config } from "../../config";

const VITE_API_URL = config.VITE_API_URL

export default function ResourceImage({ resource }: { resource: Resource }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loaded, setLoaded] = useState(false);

  async function pollingImage() {
    if (!resource.id) return
    if (loaded) return;
    const data = await fetch(`${VITE_API_URL}/resources/screenshots/${resource.id}`)
    switch (data.status) {
      case 200:
        setLoaded(true);
        setImageUrl(`${VITE_API_URL}/resources/screenshots/${resource.id}`);
        break;
      default:
        setImageUrl('');
        setLoaded(false);
        setTimeout(() => {
          pollingImage()
        }, 4000)
        break;
    };
  };

  useEffect(() => {
    setTimeout(() => {
      pollingImage()
    }, 300)
  },);


  return (
    <div className="mt-3">
      {
        loaded ? <img
          src={imageUrl}
          alt="Source preview"
          className="w-full border border-slate-600 rounded bg-white"
        /> : <div className="w-full h-full align-middle rounded animate-pulse">Loading preview...</div>
      }
    </div>
  );
}
