import { useState, useEffect, useRef } from "react";
import type { Resource } from "../types/resource";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function ResoueceImage({ resource }: { resource: Resource }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const pollingRef = useRef<number | undefined>(undefined);

  async function pollingImage() {
    if (!resource.id) return
    if (loaded) return;
    const data = await fetch(`${VITE_API_URL}/resources/screenshots/${resource.id}`)
    switch (data.status) {
      case 200:
        setLoaded(true);
        setImageUrl(`${VITE_API_URL}/resources/screenshots/${resource.id}`);
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
      // TODO: FIND A BETTER WAY TO DO THIS
      const interval = setInterval(pollingImage, 1000) as unknown as number;
      pollingRef.current = interval;
    };
    startPolling();
    return () => {
      clearInterval(pollingRef.current)
    }
    // TODO: ADD dependency to trigger polling
  }, [resource]);


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
