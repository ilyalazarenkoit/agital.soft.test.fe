"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "@phosphor-icons/react";
import { useLocale } from "@/components/LocaleProvider";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export default function ProductActions({ product }: Props) {
  const { t } = useLocale();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-(--dialog-button-accept-all-color) px-6 py-3 text-base font-semibold text-(--dialog-button-accept-all-text-color) transition hover:bg-(--dialog-button-accept-all-color-hover) disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingCart weight="bold" className="h-5 w-5" />
        {t.product.addToCart}
      </button>
      <button
        onClick={handleFavoriteClick}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-(--dialog-separator-color) bg-white px-6 py-3 text-base font-semibold text-(--dialog-text-color) transition hover:bg-(--dialog-card-background-color)"
      >
        <Heart
          weight={isFavorite ? "fill" : "regular"}
          className={`h-5 w-5 transition-colors ${
            isFavorite
              ? "text-(--dialog-button-accept-all-color)"
              : "text-(--dialog-link-secondary-color)"
          }`}
        />
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
    </div>
  );
}
