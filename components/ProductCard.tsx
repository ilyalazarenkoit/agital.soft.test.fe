"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Star, ShoppingCart } from "@phosphor-icons/react";
import { useLocale } from "@/components/LocaleProvider";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

function formatPrice(uvp: number, discount: number) {
  const final = Math.max(uvp - discount, 0);
  return { final, uvp, discount };
}

export default function ProductCard({ product }: Props) {
  const { t } = useLocale();
  const { final, uvp, discount } = formatPrice(
    product.price.uvp,
    product.price.discount
  );
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to cart logic
  };

  return (
    <Link
      href={`/catalog/${product._id}`}
      className="group flex h-full flex-col rounded-2xl border border-(--dialog-separator-color) bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-(--dialog-card-background-color)">
        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-(--dialog-link-secondary-color)">
            {t.product.noImage}
          </div>
        )}
        {discount > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-(--dialog-button-accept-all-color) px-3 py-1 text-xs font-semibold text-(--dialog-button-accept-all-text-color)">
            -{Math.round((discount / uvp) * 100)}%
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`${
                product.inStock ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {product.inStock ? t.product.inStock : t.product.outOfStock}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs font-semibold text-amber-500">
            <Star weight="fill" className="h-4 w-4" />
            <span>
              {product.avgRating.toFixed(1)}{" "}
              <span className="text-(--dialog-link-secondary-color)">
                ({product.reviewCount})
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 text-base font-semibold text-(--dialog-text-color)">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm font-medium text-(--dialog-link-secondary-color)">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-semibold text-(--dialog-text-color)">
            €{final.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-sm font-medium text-(--dialog-link-secondary-color) line-through">
              €{uvp.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleFavoriteClick}
            className="flex items-center justify-center rounded-lg cursor-pointer border border-(--dialog-separator-color) bg-white p-2 transition hover:bg-(--dialog-card-background-color)"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              weight={isFavorite ? "fill" : "regular"}
              className={`h-5 w-5 transition-colors ${
                isFavorite
                  ? "text-(--dialog-button-accept-all-color)"
                  : "text-(--dialog-link-secondary-color)"
              }`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-(--dialog-button-accept-all-color) px-4 py-2 text-sm font-semibold text-(--dialog-button-accept-all-text-color) transition hover:bg-(--dialog-button-accept-all-color-hover)"
          >
            <ShoppingCart weight="bold" className="h-4 w-4" />
            {t.product.addToCart}
          </button>
        </div>
      </div>
    </Link>
  );
}
