"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Locale, LOCALES, Messages } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
  locales: typeof LOCALES;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: ReactNode;
  messages: Record<Locale, Messages>;
};

const LOCALE_STORAGE_KEY = "app_locale";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "de";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && (stored === "de" || stored === "en" || stored === "fr")) {
    return stored as Locale;
  }
  return "de";
}

function saveLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

export function LocaleProvider({ children, messages }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>("de");

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored !== locale) {
      setLocaleState(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: messages[locale],
      locales: LOCALES,
    }),
    [locale, messages]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
