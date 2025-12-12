import { notFound } from "next/navigation";
import { Product } from "@/lib/types";
import ProductDetailHeader from "@/components/productDetails/ProductDetailHeader";
import ProductImageGallery from "@/components/productDetails/ProductImageGallery";
import ProductPriceBox from "@/components/productDetails/ProductPriceBox";
import ProductActions from "@/components/productDetails/ProductActions";
import ProductReviews from "@/components/productDetails/ProductReviews";

export const dynamic = "force-dynamic";

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to load product");
  }
  return res.json();
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  let product: Product | null = null;
  let error: string | null = null;

  try {
    product = await fetchProduct(id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load";
  }

  if (error || !product) {
    return (
      <section className="flex flex-col gap-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Product not found"}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <ProductDetailHeader product={product} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductImageGallery images={product.images} name={product.name} />
        <div className="flex flex-col gap-6">
          <ProductPriceBox product={product} />
          <ProductActions product={product} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-(--dialog-text-color)">
          Description
        </h2>
        <p className="text-base leading-relaxed text-(--dialog-link-secondary-color)">
          {product.longDescription}
        </p>
      </div>
      <ProductReviews productId={product._id} />
    </section>
  );
}
