import { useState, useEffect, useRef } from "react";
import type { Resource } from "../types/resource";

const API_BASE = import.meta.env.VITE_API_URL as string;

export default function ResoueceImage({ resource }: { resource: Resource }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const pollingRef = useRef<number | undefined>(undefined);

  async function pollingImage() {
    if (!resource.id) return
    const data = await fetch(`${API_BASE}/resources/screenshots/${resource.id}`)
    switch (data.status) {
      case 200:
        setLoaded(true);
        setImageUrl(`${API_BASE}/resources/screenshots/${resource.id}`);
        break;
      case 404:
        setImageUrl('');
        setLoaded(false);
        break;
      default:
        setImageUrl('');
        setLoaded(false);
        break;
    };
  };

  useEffect(() => {
    if (loaded) return;
    const startPolling = () => {
      pollingRef.current = setInterval(() => {
        pollingImage();
      }, 1000);
    };
    startPolling();
    return () => {
      clearInterval(pollingRef.current)
    }
    // TODO: ADD dependency to trigger polling
  }, [imageUrl]);


  if (loaded) {
    return (
      <div className="mt-3">
        <img
          src={imageUrl}
          alt="Source preview"
          className="w-full border border-slate-600 rounded bg-white"
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }

  return null;
}
