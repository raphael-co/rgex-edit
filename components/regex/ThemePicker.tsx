"use client";

import { t, type Locale } from "@/lib/i18n";
import type { ThemeKey } from "./types";
import { THEME_ORDER } from "./constants";
import { Mail, Lock, Link2, Globe, Calendar, Code2 } from "lucide-react";

const ICONS: Record<ThemeKey, any> = {
  custom: Code2,
  email: Mail,
  password: Lock,
  url: Link2,
  ipv4: Globe,
  date: Calendar
};

export default function ThemePicker({
  locale,
  value,
  onChange
}: {
  locale: Locale;
  value: ThemeKey;
  onChange: (k: ThemeKey) => void;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm font-medium mb-3">{t(locale, "re_theme_title")}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THEME_ORDER.map((k) => {
          const Icon = ICONS[k];
          const active = value === k;
          return (
            <button
              key={k}
              onClick={() => onChange(k)}
              type="button"
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left hover:shadow-sm transition ${
                active ? "ring-2 ring-black dark:ring-white" : ""
              }`}
              title={t(locale, `re_theme_${k}_desc` as any)}
            >
              <Icon className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium">{t(locale, `re_theme_${k}` as any)}</div>
                <div className="text-xs opacity-60 hidden sm:block">
                  {t(locale, `re_theme_${k}_desc` as any)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
