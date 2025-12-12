"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function CatalogEmptyState() {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-center rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color) px-4 py-10 text-sm font-medium text-(--dialog-link-secondary-color)">
      {t.catalog.noProducts}
    </div>
  );
}
