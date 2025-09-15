"use client";

import { t, type Locale } from "@/lib/i18n";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  locale: Locale;
  previewHTML: string;
  replaced: string;
  testText: string;
  onCopyInput: (s: string) => void;
  onCopyOutput: (s: string) => void;
};

export default function PreviewPane({
  locale,
  previewHTML,
  replaced,
  testText,
  onCopyInput,
  onCopyOutput
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [wrap, setWrap] = useState<"pre" | "wrap">("wrap");
  const [fontSize, setFontSize] = useState<number>(14);
  const [leftFirst, setLeftFirst] = useState<boolean>(true);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  useEffect(() => {
    const root = previewRef.current;
    if (!root) return;
    const marks = root.querySelectorAll("mark");
    setMatchCount(marks.length);
    setActiveIdx(marks.length ? 0 : -1);
  }, [previewHTML]);

  useEffect(() => {
    const root = previewRef.current;
    if (!root || activeIdx < 0) return;
    const marks = root.querySelectorAll("mark");
    if (!marks.length) return;
    marks.forEach((m) => m.classList.remove("ring-2", "ring-black", "dark:ring-white", "rounded"));
    const el = marks[Math.min(activeIdx, marks.length - 1)];
    if (el) {
      el.classList.add("ring-2", "ring-black", "dark:ring-white", "rounded");
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [activeIdx, previewHTML]);

  function prevMatch() {
    if (!matchCount) return;
    setActiveIdx((i) => (i <= 0 ? matchCount - 1 : i - 1));
  }
  function nextMatch() {
    if (!matchCount) return;
    setActiveIdx((i) => (i >= matchCount - 1 ? 0 : i + 1));
  }

  function copyHighlightedHtml() {
    const html = previewRef.current?.innerHTML ?? "";
    navigator.clipboard.writeText(html);
  }

  function downloadOutput() {
    const blob = new Blob([replaced], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regex-output.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const codeWrapCls = useMemo(
    () => (wrap === "wrap" ? "whitespace-pre-wrap break-words" : "whitespace-pre"),
    [wrap]
  );

  const HighlightsPanel = (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-xs uppercase opacity-60">{t(locale, "re_preview_matches")}</div>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="px-2 py-0.5 rounded border text-xs"
            onClick={prevMatch}
            title="Previous match"
            disabled={!matchCount}
            type="button"
          >
            ◀︎
          </button>
          <span className="text-xs opacity-70 tabular-nums">
            {matchCount ? `${activeIdx + 1}/${matchCount}` : "0/0"}
          </span>
          <button
            className="px-2 py-0.5 rounded border text-xs"
            onClick={nextMatch}
            title="Next match"
            disabled={!matchCount}
            type="button"
          >
            ▶︎
          </button>
          <button
            className="px-2 py-0.5 rounded border text-xs"
            onClick={copyHighlightedHtml}
            title="Copy highlighted HTML"
            type="button"
          >
            HTML
          </button>
        </div>
      </div>
      <div
        ref={previewRef}
        className="regex-preview rounded-xl border p-3 overflow-auto bg-white dark:bg-zinc-900"
        style={{ fontSize }}
        dangerouslySetInnerHTML={{ __html: previewHTML }}
      />
    </div>
  );

  const ReplacedPanel = (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-xs uppercase opacity-60">{t(locale, "re_preview_replaced")}</div>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="px-2 py-0.5 rounded border text-xs"
            onClick={() => onCopyOutput(replaced)}
            title={t(locale, "re_copy_output")}
            type="button"
          >
            {t(locale, "re_copy_output")}
          </button>
          <button
            className="px-2 py-0.5 rounded border text-xs"
            onClick={downloadOutput}
            title="Download .txt"
            type="button"
          >
            ⬇︎
          </button>
          <button
            className="px-2 py-0.5 rounded border text-xs"
            onClick={() => setWrap((w) => (w === "wrap" ? "pre" : "wrap"))}
            title={wrap === "wrap" ? "No wrap" : "Wrap"}
            type="button"
          >
            {wrap === "wrap" ? "No-wrap" : "Wrap"}
          </button>
        </div>
      </div>
      <pre
        className={`rounded-xl border p-3 overflow-auto bg-white dark:bg-zinc-900 ${codeWrapCls}`}
        style={{ fontSize }}
      >
        {replaced}
      </pre>
    </div>
  );

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-medium">{t(locale, "re_highlight")}</div>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="px-2 py-1 rounded-lg border"
            onClick={() => onCopyInput(testText)}
            type="button"
            title={t(locale, "re_copy_input")}
          >
            {t(locale, "re_copy_input")}
          </button>
          <button
            className="px-2 py-1 rounded-lg border"
            onClick={() => onCopyOutput(replaced)}
            type="button"
            title={t(locale, "re_copy_output")}
          >
            {t(locale, "re_copy_output")}
          </button>

          <div className="flex items-center gap-1">
            <button
              className="px-2 py-1 rounded-lg border"
              onClick={() => setFontSize((s) => Math.max(10, s - 1))}
              type="button"
              title="A−"
            >
              A−
            </button>
            <span className="text-xs opacity-70 w-8 text-center tabular-nums">{fontSize}px</span>
            <button
              className="px-2 py-1 rounded-lg border"
              onClick={() => setFontSize((s) => Math.min(28, s + 1))}
              type="button"
              title="A+"
            >
              A+
            </button>
          </div>

          <button
            className="px-2 py-1 rounded-lg border"
            onClick={() => setLeftFirst((v) => !v)}
            type="button"
            title="Swap panes"
          >
            ⇄
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {leftFirst ? (
          <>
            {HighlightsPanel}
            {ReplacedPanel}
          </>
        ) : (
          <>
            {ReplacedPanel}
            {HighlightsPanel}
          </>
        )}
      </div>

      <style jsx>{`
        .regex-preview :global(mark) {
          background: rgba(250, 204, 21, 0.45); /* amber-300 @ ~45% */
          padding: 0 0.1em;
          border-radius: 0.25rem;
        }
        .regex-preview :global(mark.ring-2) {
          background: rgba(250, 204, 21, 0.8);
        }
      `}</style>
    </div>
  );
}
