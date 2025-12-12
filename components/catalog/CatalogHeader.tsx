"use client";

import { useLocale } from "@/components/LocaleProvider";
import SortSelector from "@/components/SortSelector";
import CatalogSearch from "@/components/catalog/CatalogSearch";

type Props = {
  total?: number;
};

export default function CatalogHeader({ total }: Props) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <h1 className="text-2xl font-semibold text-(--dialog-text-color)">
          {t.catalog.title}
        </h1>
        <div className="flex-1">
          <CatalogSearch />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <SortSelector />
          {total !== undefined && (
            <p className="text-sm font-medium text-(--dialog-link-secondary-color)">
              {total} {total === 1 ? t.catalog.product : t.catalog.products}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
