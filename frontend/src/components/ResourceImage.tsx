interface ResourceImageProps {
  imageUrl: string;
  imageLoading: boolean;
}

export default function ResourceImage({ imageUrl, imageLoading }: ResourceImageProps) {
  return (
    <div className="mt-3">
      {
        !imageLoading ? <img
          src={imageUrl}
          alt="Source preview"
          className="w-full border border-slate-600 rounded bg-white"
        /> : <div className="w-full h-full align-middle rounded animate-pulse">Loading preview...</div>
      }
    </div>
  );
}
