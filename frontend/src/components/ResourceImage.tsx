interface ResourceImageProps {
  imageUrl: string;
  imageLoading: boolean;
}

export default function ResourceImage({ imageUrl, imageLoading }: ResourceImageProps) {
  if (imageLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-surface to-bg-elevated animate-pulse" />
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt="Resource preview"
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}
