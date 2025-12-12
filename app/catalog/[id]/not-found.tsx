import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-(--dialog-text-color)">
        Product Not Found
      </h1>
      <p className="text-(--dialog-link-secondary-color)">
        The product you are looking for does not exist.
      </p>
      <Link
        href="/catalog"
        className="rounded-lg bg-(--dialog-button-accept-all-color) px-4 py-2 text-sm font-semibold text-(--dialog-button-accept-all-text-color) transition hover:bg-(--dialog-button-accept-all-color-hover)"
      >
        Back to Catalog
      </Link>
    </section>
  );
}
