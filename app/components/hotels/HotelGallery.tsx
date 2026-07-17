"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import HotelImage from "@/app/components/hotels/HotelImage";
import type { HotelImage as HotelImageView } from "@/lib/types/hotel";
import {
  formatMorePhotosLabel,
  getHotelGalleryLayout,
} from "@/lib/hotels/hotelGalleryLayout";
import { cn } from "@/lib/cn";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Counter from "yet-another-react-lightbox/plugins/counter";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface HotelGalleryProps {
  title: string;
  images?: HotelImageView[];
}

export default function HotelGallery({
  title,
  images = [],
}: HotelGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const layout = getHotelGalleryLayout(images);

  if (!layout) {
    return (
      <section className="mx-auto w-full min-w-0 max-w-6xl px-4 pt-6">
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-surface text-muted md:h-96">
          <Images size={28} className="text-slate-600" strokeWidth={1.5} />
          <p className="text-sm">No photos available</p>
        </div>
      </section>
    );
  }

  const {
    total,
    main,
    sidePreviews,
    morePhotosCount,
    morePhotosStartIndex,
    slides,
  } = layout;

  function openAt(nextIndex: number) {
    setIndex(nextIndex);
    setOpen(true);
  }

  function openSidePreview(previewIndex: number) {
    const isLastSide = previewIndex === sidePreviews.length - 1;

    if (isLastSide && morePhotosCount > 0) {
      openAt(morePhotosStartIndex);
      return;
    }

    openAt(previewIndex + 1);
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-6xl px-4 pt-6">
      <div className="relative max-w-full overflow-hidden rounded-3xl border border-border/70">
        {total === 1 ? (
          <button
            type="button"
            onClick={() => openAt(0)}
            className="relative block h-72 w-full min-w-0 cursor-pointer overflow-hidden md:h-130"
          >
            <HotelImage
              src={main.src}
              alt={title}
              fill
              priority
              sizes="(max-width:768px) 100vw, 1152px"
              className="object-cover transition duration-300 hover:brightness-105"
            />
          </button>
        ) : (
          <>
            <div className="hidden min-w-0 gap-1.5 md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2">
              <button
                type="button"
                onClick={() => openAt(0)}
                className="relative h-130 min-w-0 cursor-pointer overflow-hidden md:col-span-3 md:row-span-2"
              >
                <HotelImage
                  src={main.src}
                  alt={title}
                  fill
                  priority
                  sizes="75vw"
                  className="object-cover transition duration-300 hover:brightness-105"
                />
              </button>

              {sidePreviews.map((image, previewIndex) => {
                const isLastSide = previewIndex === sidePreviews.length - 1;
                const showMoreOverlay = isLastSide && morePhotosCount > 0;

                return (
                  <button
                    key={image.index}
                    type="button"
                    onClick={() => openSidePreview(previewIndex)}
                    className="relative h-63.5 min-w-0 cursor-pointer overflow-hidden"
                  >
                    <HotelImage
                      src={image.src}
                      alt={`${title} ${previewIndex + 2}`}
                      fill
                      sizes="25vw"
                      className="object-cover transition duration-300 hover:brightness-105"
                    />

                    {showMoreOverlay ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            +{morePhotosCount}
                          </div>
                          <div className="mt-1 text-xs text-white/80">
                            {formatMorePhotosLabel(morePhotosCount)}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => openAt(0)}
              className="relative block h-72 w-full min-w-0 cursor-pointer overflow-hidden md:hidden"
            >
              <HotelImage
                src={main.src}
                alt={title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => openAt(0)}
          className={cn(
            "absolute bottom-4 right-4 rounded-xl border border-white/10 bg-black/70",
            "px-4 py-2 text-sm font-medium text-white backdrop-blur-md",
            "transition hover:bg-black/85",
          )}
        >
          {total === 1 ? "View photo" : `Show all photos (${total})`}
        </button>
      </div>

      {total > 1 ? (
        <div className="mt-4 flex w-full max-w-full gap-3 overflow-x-auto pb-2 md:hidden">
          {images.map((image, slideIndex) => (
            <button
              key={image.index}
              type="button"
              onClick={() => openAt(slideIndex)}
              className={cn(
                "relative h-20 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl",
                "border border-border transition hover:border-[#30cfd0]/40",
                slideIndex === 0 && "ring-1 ring-[#30cfd0]/40",
              )}
            >
              <HotelImage
                src={image.src}
                alt={`${title} ${slideIndex + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Counter, Zoom, Thumbnails]}
        carousel={{ finite: true }}
        counter={{ separator: " / " }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          border: 0,
          borderRadius: 12,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
      />
    </section>
  );
}
