"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

type Props = {
  titleKey: string;
  descriptionKey?: string;
  ctaHref?: string;
  ctaLabelKey?: string;
};

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const key of parts) {
    if (typeof current === "object" && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return "";
    }
  }
  return typeof current === "string" ? current : "";
}

export default function SectionHeading({
  titleKey,
  descriptionKey,
  ctaHref,
  ctaLabelKey,
}: Props) {
  const { t } = useLocale();
  const title = getNestedValue(t as Record<string, unknown>, titleKey);
  const description = descriptionKey
    ? getNestedValue(t as Record<string, unknown>, descriptionKey)
    : undefined;
  const ctaLabel = ctaLabelKey
    ? getNestedValue(t as Record<string, unknown>, ctaLabelKey)
    : undefined;

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-(--dialog-text-color)">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm font-medium text-(--dialog-link-secondary-color)">
            {description}
          </p>
        ) : null}
      </div>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="text-sm font-semibold text-(--dialog-link-primary-color) transition hover:text-(--dialog-link-secondary-color)"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
