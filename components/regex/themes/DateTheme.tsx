"use client";

import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

type Format = "ymd" | "dmy";

export default function DateTheme({
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
  const [format, setFormat] = useState<Format>("ymd");
  const [strictLeadingZero, setStrictLeadingZero] = useState(true);

  useEffect(() => {
    const dd = strictLeadingZero ? String.raw`(0[1-9]|[12]\d|3[01])` : String.raw`([1-9]|[12]\d|3[01])`;
    const mm = strictLeadingZero ? String.raw`(0[1-9]|1[0-2])` : String.raw`([1-9]|1[0-2])`;
    const yyyy = String.raw`(\d{4})`;

    let pat = "";
    let sample = "";
    let repl = "";

    if (format === "ymd") {
      pat = String.raw`\b${yyyy}-${strictLeadingZero ? "(0[1-9]|1[0-2])" : "([1-9]|1[0-2])"}-${strictLeadingZero ? "(0[1-9]|[12]\\d|3[01])" : "([1-9]|[12]\\d|3[01])"}\b`;
      sample = "Dates: 2025-09-11, 11/09/2025";
      repl = "$3/$2/$1";
    } else {
      pat = String.raw`\b${dd}\/${mm}\/${yyyy}\b`;
      sample = "Dates: 11/09/2025, 2025-09-11";
      repl = "$3-$2-$1";
    }

    setPattern(pat);
    setFlags("g");
    setTest(sample);
    setReplace(repl);
  }, [format, strictLeadingZero, setPattern, setFlags, setTest, setReplace]);

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm font-medium">{t(locale, "re_theme_date")}</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2">
          <span className="text-sm w-36">{t(locale, "re_date_format")}</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="rounded border px-2 py-1"
          >
            <option value="ymd">YYYY-MM-DD</option>
            <option value="dmy">DD/MM/YYYY</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={strictLeadingZero}
            onChange={(e) => setStrictLeadingZero(e.target.checked)}
          />
          <span className="text-sm">{t(locale, "re_date_leading_zero")}</span>
        </label>
      </div>
    </div>
  );
}
