import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import HomeWelcome from "@/components/home/HomeWelcome";
import HomeEmptyState from "@/components/home/HomeEmptyState";
import { Product } from "@/lib/types";

type HomeResponse = {
  newest: Product[];
  topRated: Product[];
};
async function fetchHomeProducts(): Promise<HomeResponse> {
  const res = await fetch("/api/home?limit=10", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load products");
  }
  return res.json();
}

export default async function HomePage() {
  let data: HomeResponse | null = null;
  let error: string | null = null;

  try {
    data = await fetchHomeProducts();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load";
  }

  return (
    <section className="flex flex-col gap-10">
      <HomeWelcome />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <SectionHeading
              titleKey="home.newestTitle"
              descriptionKey="home.newestDescription"
              ctaHref="/catalog?sort=newest"
              ctaLabelKey="home.viewAll"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.newest?.length ? (
                data.newest.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <HomeEmptyState />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SectionHeading
              titleKey="home.topRatedTitle"
              descriptionKey="home.topRatedDescription"
              ctaHref="/catalog?sort=top-rated"
              ctaLabelKey="home.viewAll"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data?.topRated?.length ? (
                data.topRated.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <HomeEmptyState />
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
