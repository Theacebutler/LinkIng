interface ResourceImageProps {
  imageUrl: string;
  imageLoading: boolean;
  imageLoadingError: boolean;
}
export default function ResourceImage({ imageUrl, imageLoading, imageLoadingError }: ResourceImageProps) {
  return (
    <div className="mt-3">
      {
        imageLoading ? <img
          src={imageUrl}
          alt="Source preview"
          className="w-full border border-slate-600 rounded bg-white"
        /> : imageLoadingError ?
          <div className="w-full h-full align-middle rounded">Error loading preview</div>
          : <div className="w-full h-full align-middle rounded animate-pulse">Loading preview...</div>
      }
    </div>
  );
}
