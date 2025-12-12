"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function LoginHeader() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-(--dialog-text-color)">
        {t.auth.signIn}
      </h1>
      <p className="font-medium text-(--dialog-link-secondary-color)">
        {t.auth.signInDescription}
      </p>
    </div>
  );
}
