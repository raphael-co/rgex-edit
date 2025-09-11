"use client";

import { t, type Locale } from "@/lib/i18n";
import type { MatchRow } from "./types";

export default function ResultsTable({
  locale,
  rows
}: {
  locale: Locale;
  rows: MatchRow[];
}) {
  return (
    <div className="rounded-2xl border p-4 overflow-auto">
      <div className="text-sm font-medium mb-2">{t(locale, "re_results")}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="[&>th]:text-left [&>th]:px-2 [&>th]:py-1 sticky top-0 bg-white dark:bg-zinc-900">
            <th>#</th>
            <th>{t(locale, "re_span")}</th>
            <th>{t(locale, "re_match")}</th>
            <th>{t(locale, "re_groups")}</th>
          </tr>
        </thead>
        <tbody className="[&>tr>td]:px-2 [&>tr>td]:py-1 align-top">
          {rows.map((r) => (
            <tr key={r.index} className="border-t">
              <td className="opacity-70">{r.index}</td>
              <td className="font-mono text-xs opacity-70">
                [{r.start}, {r.end})
              </td>
              <td className="font-mono break-all">{r.match}</td>
              <td className="font-mono text-xs">
                <div className="space-y-1">
                  {r.numberedGroups.length > 0 && (
                    <div>
                      <div className="opacity-70">{t(locale, "re_numbered_groups")}</div>
                      <div className="flex flex-wrap gap-1">
                        {r.numberedGroups.map((g, i) => (
                          <code key={i} className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">
                            ${i + 1}={g ?? "—"}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                  {Object.keys(r.groups).length > 0 && (
                    <div>
                      <div className="opacity-70">{t(locale, "re_named_groups")}</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(r.groups).map(([k, v]) => (
                          <code key={k} className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">
                            {k}={v ?? "—"}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                  {r.numberedGroups.length === 0 &&
                    Object.keys(r.groups).length === 0 && (
                      <span className="opacity-60">—</span>
                    )}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center opacity-60 py-6">
                {t(locale, "re_no_match")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
