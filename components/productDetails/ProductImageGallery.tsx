"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { ProductImage } from "@/lib/types";

type Props = {
  images: ProductImage[];
  name: string;
};

export default function ProductImageGallery({ images, name }: Props) {
  const { t } = useLocale();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color)">
        <p className="text-sm text-(--dialog-link-secondary-color)">
          {t.product.noImage}
        </p>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color)">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt || name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                selectedIndex === index
                  ? "border-(--dialog-button-accept-all-color)"
                  : "border-(--dialog-separator-color)"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${name} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
