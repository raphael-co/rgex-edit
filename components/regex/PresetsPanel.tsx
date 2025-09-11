"use client";

import { t, type Locale } from "@/lib/i18n";
import type { Preset } from "./types";
import { encodeState } from "./utils";

type Props = {
  locale: Locale;
  presets: Preset[];
  pattern: string;
  flags: string;
  testText: string;
  replaceWith: string;
  onSave: (p: Preset) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PresetsPanel({
  locale,
  presets,
  pattern,
  flags,
  testText,
  replaceWith,
  onSave,
  onExport,
  onImport,
  onLoad,
  onDelete
}: Props) {
  function copyShareUrl() {
    const qs = encodeState(pattern, flags, testText, replaceWith);
    const url = `${location.origin}${location.pathname}?${qs}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{t(locale, "re_presets")}</span>
        <button
          className="ml-auto px-2 py-1 rounded-lg border"
          onClick={() =>
            onSave({
              id: `user-${Date.now()}`,
              name: `Preset ${new Date().toLocaleString()}`,
              pattern,
              flags,
              test: testText,
              replace: replaceWith
            })
          }
          type="button"
        >
          {t(locale, "re_preset_save")}
        </button>
        <button className="px-2 py-1 rounded-lg border" onClick={onExport} type="button">
          {t(locale, "re_preset_export")}
        </button>
        <label className="px-2 py-1 rounded-lg border cursor-pointer">
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
              e.currentTarget.value = "";
            }}
          />
          {t(locale, "re_preset_import")}
        </label>
        <button className="px-2 py-1 rounded-lg border" onClick={copyShareUrl} type="button">
          {t(locale, "re_share")}
        </button>
      </div>

      <div className="max-h-56 overflow-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white dark:bg-zinc-900">
            <tr className="[&>th]:text-left [&>th]:px-2 [&>th]:py-1">
              <th>{t(locale, "re_preset_name")}</th>
              <th>{t(locale, "re_preset_regex")}</th>
              <th className="w-24">{t(locale, "re_actions")}</th>
            </tr>
          </thead>
          <tbody className="[&>tr>td]:px-2 [&>tr>td]:py-1 align-top">
            {presets.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="font-medium">{p.name}</td>
                <td className="font-mono text-xs opacity-80 break-all">/{p.pattern}/{p.flags}</td>
                <td className="space-x-2">
                  <button
                    className="px-2 py-0.5 rounded border"
                    onClick={() => onLoad(p.id)}
                    type="button"
                  >
                    {t(locale, "re_load")}
                  </button>
                  <button
                    className="px-2 py-0.5 rounded border"
                    onClick={() => onDelete(p.id)}
                    type="button"
                  >
                    {t(locale, "re_delete")}
                  </button>
                </td>
              </tr>
            ))}
            {presets.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center opacity-60 py-4">
                  {t(locale, "re_no_presets")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
