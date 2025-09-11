"use client";

import { t, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  testText: string;
  onChange: (v: string) => void;
  rowsCount: number;
  ms: number;
  error: string;
};

export default function TestInput({
  locale,
  testText,
  onChange,
  rowsCount,
  ms,
  error
}: Props) {
  return (
    <div className="rounded-2xl border p-4 space-y-2">
      <label className="text-sm font-medium">{t(locale, "re_test_text")}</label>
      <textarea
        value={testText}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-40 rounded-xl border px-3 py-2 font-mono"
        placeholder={t(locale, "re_test_placeholder")}
        spellCheck={false}
      />
      <div className="text-sm opacity-70">
        {"— "}
        <span className="font-medium">{rowsCount}</span> {t(locale, "re_matches")} ·{" "}
        <span className="font-medium">{ms.toFixed(2)} ms</span>
      </div>
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {t(locale, "re_error")}: {error}
        </div>
      )}
    </div>
  );
}
