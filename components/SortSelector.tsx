"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SortSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const currentSort = searchParams.get("sort") || "newest";
  const hasSearch = !!searchParams.get("q")?.trim();

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams();
    params.set("sort", sort);
    params.delete("q");
    params.delete("page");
    router.push(`/catalog?${params.toString()}`);
  };

  if (hasSearch) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-(--dialog-text-color)"
      >
        {t.catalog.sortLabel}
      </label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px] cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest" className="cursor-pointer">{t.catalog.newest}</SelectItem>
          <SelectItem value="top-rated" className="cursor-pointer">{t.catalog.topRated}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
