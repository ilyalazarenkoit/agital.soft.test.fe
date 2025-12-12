"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function HomeWelcome() {
  const { t } = useLocale();

  return (
    <div className="rounded-2xl border border-(--dialog-separator-color) bg-white px-6 py-8 shadow-sm">
      <h1 className="mt-2 text-2xl font-semibold text-(--dialog-text-color)">
        {t.home.welcomeTitle}
      </h1>
      <p className="mt-3 text-base font-medium text-(--dialog-link-secondary-color)">
        {t.home.welcomeDescription}
      </p>
    </div>
  );
}
