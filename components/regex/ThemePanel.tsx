"use client";

import type { Locale } from "@/lib/i18n";
import type { ThemeKey } from "./types";
import EmailTheme from "./themes/EmailTheme";
import PasswordTheme from "./themes/PasswordTheme";
import UrlTheme from "./themes/UrlTheme";
import IPv4Theme from "./themes/IPv4Theme";
import DateTheme from "./themes/DateTheme";

export default function ThemePanel({
  locale,
  theme,
  setPattern,
  setFlags,
  setTest,
  setReplace
}: {
  locale: Locale;
  theme: ThemeKey;
  setPattern: (v: string) => void;
  setFlags: (v: string) => void;
  setTest: (v: string) => void;
  setReplace: (v: string) => void;
}) {
  if (theme === "email") {
    return (
      <EmailTheme locale={locale} setPattern={setPattern} setFlags={setFlags} setTest={setTest} setReplace={setReplace} />
    );
  }
  if (theme === "password") {
    return (
      <PasswordTheme locale={locale} setPattern={setPattern} setFlags={setFlags} setTest={setTest} setReplace={setReplace} />
    );
  }
  if (theme === "url") {
    return (
      <UrlTheme locale={locale} setPattern={setPattern} setFlags={setFlags} setTest={setTest} setReplace={setReplace} />
    );
  }
  if (theme === "ipv4") {
    return (
      <IPv4Theme locale={locale} setPattern={setPattern} setFlags={setFlags} setTest={setTest} setReplace={setReplace} />
    );
  }
  if (theme === "date") {
    return (
      <DateTheme locale={locale} setPattern={setPattern} setFlags={setFlags} setTest={setTest} setReplace={setReplace} />
    );
  }
  return null;
}
