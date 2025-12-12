import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import CatalogHeader from "@/components/catalog/CatalogHeader";
import CatalogEmptyState from "@/components/catalog/CatalogEmptyState";
import { Product } from "@/lib/types";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type CatalogResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

async function fetchCatalogProducts(
  sort: string,
  page: number,
  limit: number,
  q?: string
): Promise<CatalogResponse> {
  const baseUrl = await getBaseUrl();
  const params = new URLSearchParams();
  if (q && q.trim()) {
    params.set("q", q.trim());
  } else {
    params.set("sort", sort);
  }
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load products");
  }
  return res.json();
}

type Props = {
  searchParams: Promise<{ sort?: string; page?: string; q?: string }>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort === "top-rated" ? "top-rated" : "newest";
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = 20;
  const q = params.q?.trim();

  let data: CatalogResponse | null = null;
  let error: string | null = null;

  try {
    data = await fetchCatalogProducts(sort, page, limit, q);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load";
  }

  return (
    <section className="flex flex-col gap-6">
      <CatalogHeader total={data?.total} />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex flex-col gap-4 border-t border-(--dialog-separator-color) pt-6">
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                baseUrl="/catalog"
                searchParams={q ? { q } : { sort }}
              />
            </div>
          )}
        </>
      ) : (
        <CatalogEmptyState />
      )}
    </section>
  );
}
