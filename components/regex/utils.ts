import { ALLOWED_FLAGS } from "./constants";

export function clampFlags(raw: string): string {
  const allowed = new Set(ALLOWED_FLAGS);
  return Array.from(new Set(raw.split("").filter((f) => allowed.has(f as any)))).join("");
}

export function encodeState(p: string, f: string, ttxt: string, r?: string) {
  const enc = (s: string) => btoa(unescape(encodeURIComponent(s)));
  const q = new URLSearchParams();
  q.set("p", enc(p));
  q.set("f", enc(f));
  q.set("t", enc(ttxt));
  if (r !== undefined) q.set("r", enc(r));
  return q.toString();
}

export function decodeState(qs: string) {
  const dec = (s: string) => decodeURIComponent(escape(atob(s)));
  const p = new URLSearchParams(qs);
  const out: { p?: string; f?: string; t?: string; r?: string } = {};
  if (p.get("p")) out.p = dec(String(p.get("p")));
  if (p.get("f")) out.f = dec(String(p.get("f")));
  if (p.get("t")) out.t = dec(String(p.get("t")));
  if (p.get("r")) out.r = dec(String(p.get("r")));
  return out;
}

export function highlight(text: string, matches: { start: number; end: number }[]) {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

export function withGlobal(re: RegExp): RegExp {
  return re.global || re.sticky ? re : new RegExp(re.source, re.flags + "g");
}
