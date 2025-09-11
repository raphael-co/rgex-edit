"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

type Preset = {
  id: string;
  name: string;
  pattern: string;
  flags: string;
  test: string;
  replace?: string;
};

type MatchRow = {
  index: number;
  start: number;
  end: number;
  match: string;
  groups: Record<string, string | undefined>;
  numberedGroups: Array<string | undefined>;
};

const DEFAULT_PRESETS: Preset[] = [
  {
    id: "email",
    name: "Email",
    pattern: String.raw`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b`,
    flags: "giu",
    test: "Contact: john.doe@example.com, fake@mail, admin@sub.domain.org",
    replace: "$&"
  },
  {
    id: "url",
    name: "URL",
    pattern: String.raw`\bhttps?:\/\/[^\s/$.?#].[^\s]*`,
    flags: "giu",
    test: "Docs: https://example.com/docs, http://test.local/page?x=1",
    replace: "$&"
  },
  {
    id: "ipv4",
    name: "IPv4",
    pattern: String.raw`\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b`,
    flags: "g",
    test: "Servers: 127.0.0.1, 256.0.0.1 (invalid), 192.168.1.42",
    replace: "$&"
  },
  {
    id: "iso-date",
    name: "Date ISO (AAAA-MM-JJ)",
    pattern: String.raw`\b(\d{4})-(\d{2})-(\d{2})\b`,
    flags: "g",
    test: "Anniversaires: 2025-09-11, 11-09-2025",
    replace: "$3/$2/$1"
  }
];


function clampFlags(raw: string): string {
  // Autorise seulement les flags supportés par les moteurs JS modernes.
  // i m s u g y d (et on ignore silencieusement les autres)
  const allowed = new Set(["i", "m", "s", "u", "g", "y", "d"]);
  return Array.from(new Set(raw.split("").filter((f) => allowed.has(f)))).join("");
}

function encodeState(p: string, f: string, ttxt: string, r?: string) {
  // Encodage URL-safe en base64
  const enc = (s: string) => btoa(unescape(encodeURIComponent(s)));
  const q = new URLSearchParams();
  q.set("p", enc(p));
  q.set("f", enc(f));
  q.set("t", enc(ttxt));
  if (r !== undefined) q.set("r", enc(r));
  return q.toString();
}

function decodeState(qs: string) {
  const dec = (s: string) => decodeURIComponent(escape(atob(s)));
  const p = new URLSearchParams(qs);
  const out: { p?: string; f?: string; t?: string; r?: string } = {};
  if (p.get("p")) out.p = dec(String(p.get("p")));
  if (p.get("f")) out.f = dec(String(p.get("f")));
  if (p.get("t")) out.t = dec(String(p.get("t")));
  if (p.get("r")) out.r = dec(String(p.get("r")));
  return out;
}

function highlight(text: string, matches: { start: number; end: number }[]) {
  // Retourne du HTML sécurisé en marquant les occurrences.
  // On échappe le texte et on insère <mark> sur les plages.
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  if (!matches.length) return `<pre>${esc(text)}</pre>`;
  let html = "<pre>";
  let cursor = 0;
  for (const m of matches) {
    if (m.start > cursor) html += esc(text.slice(cursor, m.start));
    html += `<mark>${esc(text.slice(m.start, m.end))}</mark>`;
    cursor = m.end;
  }
  if (cursor < text.length) html += esc(text.slice(cursor));
  html += "</pre>";
  return html;
}

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, [key]);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

export default function RegexEditor({ locale }: { locale: Locale }) {
  const [pattern, setPattern] = useLocalStorage<string>("re_pattern", DEFAULT_PRESETS[0].pattern);
  const [flags, setFlags] = useLocalStorage<string>("re_flags", DEFAULT_PRESETS[0].flags);
  const [testText, setTestText] = useLocalStorage<string>("re_test", DEFAULT_PRESETS[0].test);
  const [replaceWith, setReplaceWith] = useLocalStorage<string>("re_replace", DEFAULT_PRESETS[0].replace ?? "");
  const [userPresets, setUserPresets] = useLocalStorage<Preset[]>("re_presets", DEFAULT_PRESETS);
  const [error, setError] = useState<string>("");
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [ms, setMs] = useState<number>(0);
  const [replaced, setReplaced] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);

  // Charger depuis l'URL si présent
  useEffect(() => {
    try {
      const qs = window.location.search.slice(1);
      if (!qs) return;
      const dec = decodeState(qs);
      if (dec.p !== undefined) setPattern(dec.p);
      if (dec.f !== undefined) setFlags(clampFlags(dec.f));
      if (dec.t !== undefined) setTestText(dec.t);
      if (dec.r !== undefined) setReplaceWith(dec.r);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compiled = useMemo(() => {
    setError("");
    try {
      const f = clampFlags(flags);
      return new RegExp(pattern, f);
    } catch (e: any) {
      setError(String(e?.message ?? e));
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags]);

  useEffect(() => {
    if (!compiled) {
      setRows([]);
      setReplaced("");
      return;
    }
    const start = performance.now();
    const mrows: MatchRow[] = [];
    const g = compiled.global || compiled.sticky ? compiled : new RegExp(compiled.source, compiled.flags + "g");
    let m: RegExpExecArray | null;
    let count = 0;
    while ((m = g.exec(testText)) && count < 10000) {
      count++;
      const numbered = Array.from(m).slice(1);
      const groups = (m as any).groups ?? {};
      mrows.push({
        index: count,
        start: m.index,
        end: m.index + m[0].length,
        match: m[0],
        groups,
        numberedGroups: numbered
      });
      if (m[0].length === 0) {
        // évite la boucle infinie si motif vide / ou lookahead nul
        g.lastIndex = g.lastIndex + 1;
      }
    }
    const end = performance.now();
    setMs(Math.max(0, end - start));
    setRows(mrows);

    // Remplacement
    try {
      const repl = replaceWith ?? "";
      const result = testText.replace(g, repl);
      setReplaced(result);
    } catch (e: any) {
      // Certaines séquences de remplacement peuvent lever des erreurs
      setReplaced("");
    }
  }, [compiled, testText, replaceWith]);

  const matchesForHighlight = useMemo(
    () => rows.map((r) => ({ start: r.start, end: r.end })),
    [rows]
  );

  const previewHTML = useMemo(() => highlight(testText, matchesForHighlight), [testText, matchesForHighlight]);

  function toggleFlag(f: string) {
    setFlags((old) => {
      const has = old.includes(f);
      const next = has ? old.replace(new RegExp(f, "g"), "") : `${old}${f}`;
      return clampFlags(next);
    });
  }

  function addPreset(p: Preset) {
    const exists = userPresets.some((x) => x.id === p.id);
    const list = exists ? userPresets.map((x) => (x.id === p.id ? p : x)) : [...userPresets, p];
    setUserPresets(list);
  }

  function loadPreset(id: string) {
    const p = userPresets.find((x) => x.id === id);
    if (!p) return;
    setPattern(p.pattern);
    setFlags(p.flags);
    setTestText(p.test);
    setReplaceWith(p.replace ?? "");
  }

  function removePreset(id: string) {
    setUserPresets(userPresets.filter((x) => x.id !== id));
  }

  function exportPresets() {
    const blob = new Blob([JSON.stringify(userPresets, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regex-presets.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importPresets(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        if (Array.isArray(json)) {
          setUserPresets(json as Preset[]);
        }
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function copyShareUrl() {
    const qs = encodeState(pattern, flags, testText, replaceWith);
    const url = `${location.origin}${location.pathname}?${qs}`;
    navigator.clipboard.writeText(url);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Controls */}
      <div className="space-y-4">
        <div className="rounded-2xl border p-4 space-y-3">
          <label className="text-sm font-medium">{t(locale, "re_pattern")}</label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 font-mono"
            placeholder="^(?:...)$"
            spellCheck={false}
          />

          <div className="flex flex-wrap items-center gap-2">
            {["g", "i", "m", "s", "u", "y", "d"].map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`px-2 py-1 rounded-lg border ${flags.includes(f) ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
                title={t(locale, `re_flag_${f}` as any)}
                type="button"
              >
                /{f}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPattern("");
                  setFlags("");
                }}
                className="px-2 py-1 rounded-lg border"
                title={t(locale, "re_clear_pattern")}
              >
                {t(locale, "re_clear")}
              </button>
              <button
                type="button"
                onClick={() => {
                  copy(`/${pattern}/${flags}`);
                }}
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
              onChange={(e) => setReplaceWith(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 font-mono"
              placeholder="$1-$2-$3"
              spellCheck={false}
            />
            <div className="text-xs opacity-70">
              {t(locale, "re_replace_help")}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t(locale, "re_presets")}</span>
            <button
              className="ml-auto px-2 py-1 rounded-lg border"
              onClick={() =>
                addPreset({
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
            <button className="px-2 py-1 rounded-lg border" onClick={exportPresets} type="button">
              {t(locale, "re_preset_export")}
            </button>
            <label className="px-2 py-1 rounded-lg border cursor-pointer">
              <input type="file" accept="application/json" hidden onChange={importPresets} />
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
                {userPresets.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="font-medium">{p.name}</td>
                    <td className="font-mono text-xs opacity-80 break-all">/{p.pattern}/{p.flags}</td>
                    <td className="space-x-2">
                      <button
                        className="px-2 py-0.5 rounded border"
                        onClick={() => loadPreset(p.id)}
                        type="button"
                      >
                        {t(locale, "re_load")}
                      </button>
                      <button
                        className="px-2 py-0.5 rounded border"
                        onClick={() => removePreset(p.id)}
                        type="button"
                      >
                        {t(locale, "re_delete")}
                      </button>
                    </td>
                  </tr>
                ))}
                {userPresets.length === 0 && (
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

        <div className="rounded-2xl border p-4 space-y-2">
          <details>
            <summary className="cursor-pointer select-none font-medium">{t(locale, "re_cheatsheet")}</summary>
            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <div className="font-semibold mb-1">{t(locale, "re_tokens")}</div>
                <ul className="list-disc ml-5 space-y-1 opacity-80">
                  <li>\d \w \s, \D \W \S</li>
                  <li>^ $ \b \B</li>
                  <li>( ) (?: ) (?&lt;name&gt; )</li>
                  <li>[abc] [^abc] [a-z]</li>
                  <li>.+? *? ?? lazy</li>
                  <li>(?= ) (?! ) (?&lt;= ) (?&lt;! )</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">{t(locale, "re_quantifiers")}</div>
                <ul className="list-disc ml-5 space-y-1 opacity-80">
                  <li>* + ?</li>
                  <li>{`{n}`}, {`{n,}`}, {`{m,n}`}</li>
                  <li>| alternation</li>
                  <li>Flags: g i m s u y d</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* RIGHT: Test & Results */}
      <div className="space-y-4">
        <div className="rounded-2xl border p-4 space-y-2">
          <label className="text-sm font-medium">{t(locale, "re_test_text")}</label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full min-h-40 rounded-xl border px-3 py-2 font-mono"
            placeholder={t(locale, "re_test_placeholder")}
            spellCheck={false}
          />
          <div className="text-sm opacity-70">
            {t(locale, "re_stats",) /* "x matches in y ms" via format below */}
            {" — "}
            <span className="font-medium">{rows.length}</span> {t(locale, "re_matches")} ·{" "}
            <span className="font-medium">{ms.toFixed(2)} ms</span>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {t(locale, "re_error")}: {error}
            </div>
          )}
        </div>

        <div className="rounded-2xl border p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{t(locale, "re_highlight")}</div>
            <button
              className="ml-auto px-2 py-1 rounded-lg border"
              onClick={() => copy(testText)}
              type="button"
            >
              {t(locale, "re_copy_input")}
            </button>
            <button
              className="px-2 py-1 rounded-lg border"
              onClick={() => copy(replaced)}
              type="button"
            >
              {t(locale, "re_copy_output")}
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase opacity-60 mb-1">{t(locale, "re_preview_matches")}</div>
              <div
                ref={previewRef}
                className="rounded-xl border p-3 overflow-auto bg-white dark:bg-zinc-900"
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
            </div>
            <div>
              <div className="text-xs uppercase opacity-60 mb-1">{t(locale, "re_preview_replaced")}</div>
              <pre className="rounded-xl border p-3 overflow-auto bg-white dark:bg-zinc-900 whitespace-pre-wrap break-words">
                {replaced}
              </pre>
            </div>
          </div>
        </div>

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
                      {r.numberedGroups.length === 0 && Object.keys(r.groups).length === 0 && (
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
      </div>
    </div>
  );
}
