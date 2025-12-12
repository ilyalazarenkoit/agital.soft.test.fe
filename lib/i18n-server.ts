import { readFileSync } from "fs";
import { join } from "path";
import { Locale, Messages } from "./i18n";

const messagesCache: Partial<Record<Locale, Messages>> = {};

export function loadMessages(locale: Locale): Messages {
  if (messagesCache[locale]) {
    return messagesCache[locale]!;
  }

  const filePath = join(
    process.cwd(),
    "public",
    "locales",
    locale,
    "common.json"
  );
  const fileContents = readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(fileContents) as Messages;
  messagesCache[locale] = parsed;
  return parsed;
}

export function getAllMessages(): Record<Locale, Messages> {
  return {
    de: loadMessages("de"),
    en: loadMessages("en"),
    fr: loadMessages("fr"),
  };
}
