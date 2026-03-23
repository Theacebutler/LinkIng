import { useState, useEffect, useRef } from "react";
import type { Resource } from "../types/resource";

const API_BASE = 'http://localhost:3000';

export default function ResoueceImage({ resource }: { resource: Resource }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const pollingRef = useRef<number | undefined>(undefined);

  async function pollingImage() {
    const data = await fetch(`${API_BASE}/api/resources/screenshots/${resource.id}`)
    switch (data.status) {
      case 200:
        setLoaded(true);
        setImageUrl(`${API_BASE}/api/resources/screenshots/${resource.id}`);
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
    const startPolling = () => {
      pollingRef.current = setInterval(() => {
        pollingImage();
      }, 1000);
    };
    startPolling();
    return () => {
      clearInterval(pollingRef.current)
    }
  }, [])


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
