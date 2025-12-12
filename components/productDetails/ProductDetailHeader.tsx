"use client";

import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export default function ProductDetailHeader({ product }: Props) {

  return (
    <div className="flex flex-col gap-4">
     
      <h1 className="text-3xl font-bold text-(--dialog-text-color)">
        {product.name}
      </h1>
      <p className="text-lg text-(--dialog-link-secondary-color)">
        {product.shortDescription}
      </p>
    </div>
  );
}
