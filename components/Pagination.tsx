"use client";

import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useLocale } from "@/components/LocaleProvider";
import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
};

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: Props) {
  const { t } = useLocale();

  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label={t.catalog.paginationAria}
    >
      {currentPage > 1 && (
        <Button variant="outline" size="sm" asChild>
          <Link
            href={buildUrl(currentPage - 1)}
            aria-label={t.catalog.previousPage}
          >
            <CaretLeft weight="bold" className="h-4 w-4" />
            {t.catalog.previous}
          </Link>
        </Button>
      )}

      {startPage > 1 && (
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href={buildUrl(1)}>1</Link>
          </Button>
          {startPage > 2 && (
            <span className="px-2 font-medium text-(--dialog-link-secondary-color)">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link
            href={buildUrl(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 font-medium text-(--dialog-link-secondary-color)">
              ...
            </span>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={buildUrl(totalPages)}>{totalPages}</Link>
          </Button>
        </>
      )}

      {currentPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link
            href={buildUrl(currentPage + 1)}
            aria-label={t.catalog.nextPage}
          >
            {t.catalog.next}
            <CaretRight weight="bold" className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </nav>
  );
}
