"use client";

import { useLocale } from "@/components/LocaleProvider";

type Props = {
  query?: string;
  isEmptyQuery?: boolean;
};

export default function SearchEmptyState({ query, isEmptyQuery }: Props) {
  const { t } = useLocale();

  if (isEmptyQuery) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color) px-4 py-12 text-center">
        <p className="text-base font-medium text-(--dialog-text-color)">
          {t.search.emptyQuery}
        </p>
        <p className="text-sm font-medium text-(--dialog-link-secondary-color)">
          {t.search.emptyQueryDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-(--dialog-separator-color) bg-(--dialog-card-background-color) px-4 py-12 text-center">
      <p className="text-base font-medium text-(--dialog-text-color)">
        {t.search.noResults}
      </p>
      {query && (
        <p className="text-sm font-medium text-(--dialog-link-secondary-color)">
          {t.search.noResultsDescription}{" "}
          <span className="font-semibold text-(--dialog-text-color)">
            &quot;{query}&quot;
          </span>
        </p>
      )}
    </div>
  );
}
