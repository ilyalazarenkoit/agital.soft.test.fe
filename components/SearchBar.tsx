"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useMemo } from "react";
import { useLocale } from "@/components/LocaleProvider";

const DEBOUNCE_MS = 400;

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const [query, setQuery] = useState(urlQuery);
  const touched = useRef(false);
  const { t } = useLocale();

  useEffect(() => {
    if (urlQuery !== query && !touched.current) {
      // Sync with URL params when user hasn't touched the input
      // This is necessary for proper URL synchronization
      setQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  useEffect(() => {
    if (!touched.current) return;
    const term = query.trim();
    if (!term) {
      if (searchParams.get("q")) {
        router.push("/search");
      }
      return;
    }

    const handle = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [query, router, searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    touched.current = true;
    const term = query.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleChange = (value: string) => {
    touched.current = true;
    setQuery(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-full border border-(--dialog-search-bar-input-border-color-default) bg-(--dialog-search-bar-input-background-color) px-3 py-2 shadow-sm ring-1 ring-transparent transition focus-within:border-(--dialog-search-bar-input-border-color-focus) focus-within:ring-(--dialog-search-bar-input-border-color-focus)"
      role="search"
      aria-label={t.search.ariaSearch}
    >
      <input
        type="search"
        name="q"
        autoComplete="off"
        placeholder={t.search.placeholder}
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        className="w-full bg-transparent text-sm text-(--dialog-search-bar-input-text-color) outline-none placeholder:text-neutral-500"
        aria-label={t.search.ariaInput}
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-(--dialog-button-accept-all-color) px-3 py-1 text-xs font-semibold text-(--dialog-button-accept-all-text-color) transition hover:bg-(--dialog-button-accept-all-color-hover)"
      >
        {t.search.submit}
      </button>
    </form>
  );
}
