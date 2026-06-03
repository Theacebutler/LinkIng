interface ResourceImageProps {
  imageUrl: string;
  imageLoading: boolean;
}

export default function ResourceImage({ imageUrl, imageLoading }: ResourceImageProps) {
  if (imageLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-bg-elevated animate-pulse" />
        <span className="relative text-[11px] text-muted/70 font-medium">Generating preview…</span>
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt="Resource preview"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
      loading="lazy"
      decoding="async"
      style={{ imageRendering: '-webkit-optimize-contrast' }}
    />
  );
}
