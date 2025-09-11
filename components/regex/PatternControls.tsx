"use client";

import { t, type Locale } from "@/lib/i18n";
import { ALLOWED_FLAGS } from "./constants";
import { clampFlags } from "./utils";

type Props = {
  locale: Locale;
  pattern: string;
  flags: string;
  replaceWith: string;
  onChangePattern: (v: string) => void;
  onChangeFlags: (v: string) => void;
  onChangeReplace: (v: string) => void;
  onClear: () => void;
  onCopyRegex: () => void;
};

export default function PatternControls({
  locale,
  pattern,
  flags,
  replaceWith,
  onChangePattern,
  onChangeFlags,
  onChangeReplace,
  onClear,
  onCopyRegex
}: Props) {
  function toggleFlag(f: string) {
    onChangeFlags(
      clampFlags(flags.includes(f) ? flags.replace(new RegExp(f, "g"), "") : `${flags}${f}`)
    );
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <label className="text-sm font-medium">{t(locale, "re_pattern")}</label>
      <input
        value={pattern}
        onChange={(e) => onChangePattern(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 font-mono"
        placeholder="^(?:...)$"
        spellCheck={false}
      />

      <div className="flex flex-wrap items-center gap-2">
        {ALLOWED_FLAGS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFlag(f)}
            className={`px-2 py-1 rounded-lg border ${
              flags.includes(f) ? "bg-black text-white dark:bg-white dark:text-black" : ""
            }`}
            title={t(locale, `re_flag_${f}` as any)}
            type="button"
          >
            /{f}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-1 rounded-lg border"
            title={t(locale, "re_clear_pattern")}
          >
            {t(locale, "re_clear")}
          </button>
          <button
            type="button"
            onClick={onCopyRegex}
            className="px-2 py-1 rounded-lg border"
          >
            {t(locale, "re_copy_regex")}
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">{t(locale, "re_replace")}</label>
        <input
          value={replaceWith}
          onChange={(e) => onChangeReplace(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 font-mono"
          placeholder="$1-$2-$3"
          spellCheck={false}
        />
        <div className="text-xs opacity-70">
          {t(locale, "re_replace_help")}
        </div>
      </div>
    </div>
  );
}
