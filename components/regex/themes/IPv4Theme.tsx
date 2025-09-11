"use client";

import { useEffect } from "react";
import { t, type Locale } from "@/lib/i18n";

export default function IPv4Theme({
  locale,
  setPattern,
  setFlags,
  setTest,
  setReplace
}: {
  locale: Locale;
  setPattern: (v: string) => void;
  setFlags: (v: string) => void;
  setTest: (v: string) => void;
  setReplace: (v: string) => void;
}) {
  useEffect(() => {
    const pat = String.raw`\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b`;
    setPattern(pat);
    setFlags("g");
    setTest("Servers: 127.0.0.1, 256.0.0.1 (invalid), 192.168.1.42");
    setReplace("$&");
  }, [setPattern, setFlags, setTest, setReplace]);

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm font-medium">{t(locale, "re_theme_ipv4")}</div>
      <p className="text-sm opacity-70 mt-1">{t(locale, "re_ipv4_desc")}</p>
    </div>
  );
}
