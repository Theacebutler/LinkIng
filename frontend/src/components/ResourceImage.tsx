interface ResourceImageProps {
  imageData: string | null;
  imageLoading: boolean;
}

export default function ResourceImage({ imageData, imageLoading }: ResourceImageProps) {
  if (imageLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 animate-skeleton" />
        <div className="absolute inset-0 flex items-center justify-center text-muted text-md font-bold">
          <span className="opacity-60">Loading preview</span>
        </div>
      </div>
    );
  }
  return (
    <img
      src={`data:image/png;base64,${imageData}`}
      alt="Resource preview"
      width={1820}
      height={720}
      className="absolute inset-0 w-full h-fit object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      style={{
        imageRendering: '-webkit-optimize-contrast',
        WebkitImageRendering: '-webkit-optimize-contrast',
        filter: 'contrast(1.04) saturate(1.05)',
      } as React.CSSProperties}
    />
  );
}
