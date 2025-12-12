"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function RegisterHeader() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-(--dialog-text-color)">
        {t.auth.createAccount}
      </h1>
      <p className="font-medium text-(--dialog-link-secondary-color)">
        {t.auth.createAccountDescription}
      </p>
    </div>
  );
}
