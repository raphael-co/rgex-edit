"use client";

import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

export default function PasswordTheme({
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
  const [minLen, setMinLen] = useState(8);
  const [maxLen, setMaxLen] = useState<number | "">(32);
  const [needLower, setNeedLower] = useState(true);
  const [needUpper, setNeedUpper] = useState(true);
  const [needDigit, setNeedDigit] = useState(true);
  const [needSpecial, setNeedSpecial] = useState(true);
  const [allowSpaces, setAllowSpaces] = useState(false);

  useEffect(() => {
    const aheads: string[] = [];
    if (needLower) aheads.push("(?=.*[a-z])");
    if (needUpper) aheads.push("(?=.*[A-Z])");
    if (needDigit) aheads.push("(?=.*\\d)");
    if (needSpecial) aheads.push(String.raw`(?=.*[^A-Za-z0-9\s])`);

    const cls = allowSpaces ? "." : "\\S";
    const len = maxLen === "" ? `{${minLen},}` : `{${minLen},${Math.max(minLen, Number(maxLen))}}`;
    const body = `${cls}${len}`;
    const pat = `^${aheads.join("")}${body}$`;

    setPattern(pat);
    setFlags("u");
    setTest("Azerty123!");
    setReplace("$&");
  }, [minLen, maxLen, needLower, needUpper, needDigit, needSpecial, allowSpaces, setPattern, setFlags, setTest, setReplace]);

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm font-medium">{t(locale, "re_theme_password")}</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2">
          <span className="text-sm w-36">{t(locale, "re_pw_minlen")}</span>
          <input type="number" min={1} value={minLen} onChange={(e) => setMinLen(Number(e.target.value || 1))} className="w-24 rounded border px-2 py-1" />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm w-36">{t(locale, "re_pw_maxlen")}</span>
          <input
            type="number"
            min={minLen}
            value={typeof maxLen === "number" ? maxLen : ""}
            onChange={(e) => {
              const v = e.target.value;
              setMaxLen(v === "" ? "" : Number(v));
            }}
            className="w-24 rounded border px-2 py-1"
            placeholder="-"
          />
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={needLower} onChange={(e) => setNeedLower(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_pw_need_lower")}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={needUpper} onChange={(e) => setNeedUpper(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_pw_need_upper")}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={needDigit} onChange={(e) => setNeedDigit(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_pw_need_digit")}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={needSpecial} onChange={(e) => setNeedSpecial(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_pw_need_special")}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowSpaces} onChange={(e) => setAllowSpaces(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_pw_allow_spaces")}</span>
        </label>
      </div>
    </div>
  );
}
