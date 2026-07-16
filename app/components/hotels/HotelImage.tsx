import Image, { type ImageProps } from "next/image";
import { isAllowedHotelImageUrl } from "@/lib/hotels/allowedImageUrls";
import { cn } from "@/lib/cn";

type Props = Omit<ImageProps, "src"> & {
  src: string;
};

function isDisplayableHotelImageSrc(src: string) {
  if (src.startsWith("/api/hotels/")) return true;
  return isAllowedHotelImageUrl(src);
}

export default function HotelImage({
  src,
  alt,
  className,
  fill,
  ...props
}: Props) {
  if (!isDisplayableHotelImageSrc(src)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface text-center text-sm text-slate-500",
          fill && "absolute inset-0 h-full w-full",
          className,
        )}
      >
        Unsupported image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      unoptimized={src.startsWith("/api/hotels/")}
      {...props}
    />
  );
}
