import en from "@/dictionnaire/en.json";
import fr from "@/dictionnaire/fr.json";

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const dict = {
  en,
  fr
} as const;

export type Dict = typeof en;
export type DictKey = keyof Dict;

export function t(locale: Locale, key: DictKey): string {
  const d = dict[locale] ?? dict.en;
  return d[key] ?? dict.en[key] ?? String(key);
}
