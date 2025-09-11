"use client";

import { useEffect, useMemo, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { useLocalStorage } from "./useLocalStorage";
import { MatchRow, Preset, ThemeKey } from "./types";
import { DEFAULT_PRESETS } from "./constants";
import { clampFlags, decodeState, highlight, withGlobal } from "./utils";
import ThemePicker from "./ThemePicker";
import ThemePanel from "./ThemePanel";
import PatternControls from "./PatternControls";
import PresetsPanel from "./PresetsPanel";
import Cheatsheet from "./Cheatsheet";
import TestInput from "./TestInput";
import PreviewPane from "./PreviewPane";
import ResultsTable from "./ResultsTable";


export default function RegexEditor({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useLocalStorage<ThemeKey>("re_theme", "custom");
  const [pattern, setPattern] = useLocalStorage<string>("re_pattern", DEFAULT_PRESETS[0].pattern);
  const [flags, setFlags] = useLocalStorage<string>("re_flags", DEFAULT_PRESETS[0].flags);
  const [testText, setTestText] = useLocalStorage<string>("re_test", DEFAULT_PRESETS[0].test);
  const [replaceWith, setReplaceWith] = useLocalStorage<string>("re_replace", DEFAULT_PRESETS[0].replace ?? "");
  const [userPresets, setUserPresets] = useLocalStorage<Preset[]>("re_presets", DEFAULT_PRESETS);
  const [error, setError] = useState<string>("");
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [ms, setMs] = useState<number>(0);
  const [replaced, setReplaced] = useState<string>("");

  // Import depuis l'URL si présent
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
    const g = withGlobal(compiled);
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
      if (m[0].length === 0) g.lastIndex = g.lastIndex + 1;
    }
    const end = performance.now();
    setMs(Math.max(0, end - start));
    setRows(mrows);

    // Remplacement
    try {
      const repl = replaceWith ?? "";
      const g2 = withGlobal(new RegExp(compiled.source, compiled.flags));
      const result = testText.replace(g2, repl);
      setReplaced(result);
    } catch {
      setReplaced("");
    }
  }, [compiled, testText, replaceWith]);

  const matchesForHighlight = useMemo(
    () => rows.map((r) => ({ start: r.start, end: r.end })),
    [rows]
  );

  const previewHTML = useMemo(
    () => highlight(testText, matchesForHighlight),
    [testText, matchesForHighlight]
  );

  // Presets
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
  function importPresets(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        if (Array.isArray(json)) setUserPresets(json as Preset[]);
      } catch {}
    };
    reader.readAsText(file);
  }
  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="grid grid-cols-1  gap-6">
        <ThemePicker locale={locale} value={theme} onChange={setTheme} />
        <ThemePanel
          locale={locale}
          theme={theme}
          setPattern={setPattern}
          setFlags={setFlags}
          setTest={setTestText}
          setReplace={setReplaceWith}
        />

        <PatternControls
          locale={locale}
          pattern={pattern}
          flags={flags}
          replaceWith={replaceWith}
          onChangePattern={setPattern}
          onChangeFlags={setFlags}
          onChangeReplace={setReplaceWith}
          onClear={() => {
            setPattern("");
            setFlags("");
          }}
          onCopyRegex={() => copy(`/${pattern}/${flags}`)}
        />

        {/* <PresetsPanel
          locale={locale}
          presets={userPresets}
          pattern={pattern}
          flags={flags}
          testText={testText}
          replaceWith={replaceWith}
          onSave={addPreset}
          onExport={exportPresets}
          onImport={importPresets}
          onLoad={loadPreset}
          onDelete={removePreset}
        /> */}

        <Cheatsheet locale={locale} />
        
        <TestInput
          locale={locale}
          testText={testText}
          onChange={setTestText}
          rowsCount={rows.length}
          ms={ms}
          error={error}
        />

        <PreviewPane
          locale={locale}
          previewHTML={previewHTML}
          replaced={replaced}
          testText={testText}
          onCopyInput={copy}
          onCopyOutput={copy}
        />

        <ResultsTable locale={locale} rows={rows} />
    </div>
  );
}
