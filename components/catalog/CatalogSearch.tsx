"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/LocaleProvider";

const DEBOUNCE_MS = 400;

export default function CatalogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const touched = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchParamsRef = useRef(searchParams);
  const { t } = useLocale();

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (!touched.current && urlQuery !== query) {
      setQuery(urlQuery);
    }
    // Sync with URL when user hasn't touched the input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  useEffect(() => {
    if (!touched.current) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const term = query.trim();
    debounceTimer.current = setTimeout(() => {
      const currentPage = searchParamsRef.current.get("page") || "1";
      const params = new URLSearchParams();

      if (term) {
        params.set("q", term);
        if (currentPage !== "1") {
          params.set("page", currentPage);
        }
      } else {
        const currentSort = searchParamsRef.current.get("sort") || "newest";
        params.set("sort", currentSort);
        params.delete("page");
      }

      router.push(`/catalog?${params.toString()}`);
      debounceTimer.current = null;
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, router]);

  const handleChange = (value: string) => {
    touched.current = true;
    setQuery(value);
  };

  return (
    <div className="w-full">
      <Input
        type="search"
        placeholder={t.search.placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full"
        aria-label={t.search.ariaInput}
      />
    </div>
  );
}
