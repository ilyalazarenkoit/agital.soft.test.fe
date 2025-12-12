"use client";

import { Star } from "@phosphor-icons/react";
import { useLocale } from "@/components/LocaleProvider";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

function formatPrice(uvp: number, discount: number) {
  const final = Math.max(uvp - discount, 0);
  return { final, uvp, discount };
}

export default function ProductPriceBox({ product }: Props) {
  const { t } = useLocale();
  const { final, uvp, discount } = formatPrice(
    product.price.uvp,
    product.price.discount
  );

  const handleRatingClick = () => {
    const reviewsSection = document.getElementById("reviews-section");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color) p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-(--dialog-text-color)">
              €{final.toFixed(2)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg font-medium text-(--dialog-link-secondary-color) line-through">
                  €{uvp.toFixed(2)}
                </span>
                <span className="rounded-full bg-(--dialog-button-accept-all-color) px-2 py-0.5 text-xs font-semibold text-(--dialog-button-accept-all-text-color)">
                  -{Math.round((discount / uvp) * 100)}%
                </span>
              </>
            )}
          </div>
          <button
            onClick={handleRatingClick}
            className="flex cursor-pointer items-center gap-1 text-lg font-semibold text-amber-500 transition hover:text-amber-600"
            aria-label={`${product.avgRating.toFixed(1)} rating, ${
              product.reviewCount
            } reviews. Click to scroll to reviews.`}
          >
            <Star weight="fill" className="h-6 w-6" />
            <span>
              {product.avgRating.toFixed(1)}{" "}
              <span className="font-medium text-(--dialog-link-secondary-color)">
                ({product.reviewCount})
              </span>
            </span>
          </button>
        </div>
        {product.price.reseller && (
          <p className="text-sm font-medium text-(--dialog-link-secondary-color)">
            Reseller price: €{product.price.reseller.toFixed(2)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${
            product.inStock ? "text-emerald-600" : "text-rose-500"
          }`}
        >
          {product.inStock ? t.product.inStock : t.product.outOfStock}
        </span>
      </div>
    </div>
  );
}
