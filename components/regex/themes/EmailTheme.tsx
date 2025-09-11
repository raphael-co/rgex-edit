"use client";

import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

export default function EmailTheme({
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
  const [allowPlus, setAllowPlus] = useState(true);
  const [allowDots, setAllowDots] = useState(true);
  const [allowSub, setAllowSub] = useState(true);
  const [minTld, setMinTld] = useState(2);

  useEffect(() => {
    // Local-part
    const parts = ["A-Za-z0-9", "_%"];
    if (allowDots) parts.push("\\.");
    if (allowPlus) parts.push("\\+");
    parts.push("\\-");
    const local = `[${parts.join("")}]+`;

    // Domaine
    const domainCore = allowSub ? `(?:[A-Za-z0-9-]+\\.)+` : `[A-Za-z0-9-]+\\.`;
    const tld = `[A-Za-z]{${Math.max(1, minTld)},}`;
    const pat = String.raw`\b${local}@${domainCore}${tld}\b`;

    setPattern(pat);
    setFlags("giu");
    setTest("Contact: john.doe+alias@example.com, sales@sub.domain.org, wrong@mail");
    setReplace("$&");
  }, [allowPlus, allowDots, allowSub, minTld, setPattern, setFlags, setTest, setReplace]);

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm font-medium">{t(locale, "re_theme_email")}</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowPlus} onChange={(e) => setAllowPlus(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_email_allow_plus")}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowDots} onChange={(e) => setAllowDots(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_email_allow_dots")}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowSub} onChange={(e) => setAllowSub(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_email_allow_subdomains")}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm w-40">{t(locale, "re_email_min_tld")}</span>
          <input
            type="number"
            min={1}
            value={minTld}
            onChange={(e) => setMinTld(Number(e.target.value || 1))}
            className="w-24 rounded border px-2 py-1"
          />
        </label>
      </div>
    </div>
  );
}
