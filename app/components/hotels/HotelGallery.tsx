"use client";

import { useState } from "react";
import Image from "next/image";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Counter from "yet-another-react-lightbox/plugins/counter";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface HotelGalleryProps {
  title: string;
  images?: {
    url: string;
  }[];
}

export default function HotelGallery({
  title,
  images = [],
}: HotelGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="flex h-125 items-center justify-center rounded-3xl border border-border bg-surface text-muted">
        No image available
      </div>
    );
  }

  const mainImage = images[1] ?? images[0];
  const previewImages = images.slice(2, 4);

  const slides = [...images.slice(1), images[0]].map((image) => ({
    src: image.url,
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
          <div
            className="relative h-65 cursor-pointer md:col-span-3 md:row-span-2 md:h-130"
            onClick={() => {
              setIndex(0);
              setOpen(true);
            }}
          >
            <Image
              src={mainImage.url}
              alt={title}
              fill
              priority
              sizes="(max-width:768px) 100vw, 75vw"
              className="object-cover transition duration-300 hover:scale-[1.02]"
            />
          </div>

          {previewImages.map((image, previewIndex) => (
            <div
              key={previewIndex}
              onClick={() => {
                setIndex(previewIndex + 1);
                setOpen(true);
              }}
              className="relative hidden h-63.5 cursor-pointer overflow-hidden md:block"
            >
              <Image
                src={image.url}
                alt={`${title} ${previewIndex + 1}`}
                fill
                sizes="25vw"
                className="object-cover transition duration-300 hover:scale-105"
              />

              {previewIndex === 1 && images.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      +{images.length - 3}
                    </div>
                    <div className="mt-1 text-sm text-white/80">
                      Pokaż pozostałe
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <button
            onClick={() => {
              setIndex(0);
              setOpen(true);
            }}
            className="
              absolute bottom-4 right-8 rounded-xl bg-black/70
              px-4 py-2 text-sm font-medium text-white
              backdrop-blur-md transition hover:bg-black/90
            "
          >
            Zobacz wszystkie zdjęcia ({images.length + 1})
          </button>
        )}
      </div>

      {/* Mobile thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 md:hidden">
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => {
                setIndex(slideIndex);
                setOpen(true);
              }}
              className="
                relative h-20 w-28 shrink-0 cursor-pointer
                overflow-hidden rounded-xl border border-border
              "
            >
              <Image
                src={slide.src}
                alt={`${title} ${slideIndex + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Thumbnails, Counter]}
        carousel={{ finite: false }}
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
