"use client";

import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

export default function UrlTheme({
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
  const [http, setHttp] = useState(true);
  const [https, setHttps] = useState(true);
  const [ftp, setFtp] = useState(false);
  const [allowQuery, setAllowQuery] = useState(true);
  const [allowFragment, setAllowFragment] = useState(true);

  useEffect(() => {
    const protos = [
      http ? "http" : null,
      https ? "https" : null,
      ftp ? "ftp" : null
    ].filter(Boolean) as string[];
    const proto = protos.length ? `(?:${protos.join("|")}):\\/\\/` : String.raw`https?:\/\/`;

    const host = String.raw`(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}`;
    const port = String.raw`(?::\d+)?`;
    const path = String.raw`(?:\/[^\s?#]*)*`;
    const query = allowQuery ? String.raw`(?:\?[^\s#]*)?` : "";
    const frag = allowFragment ? String.raw`(?:#[^\s]*)?` : "";

    const pat = String.raw`\b${proto}${host}${port}${path}${query}${frag}`;
    setPattern(pat);
    setFlags("giu");
    setTest("https://example.com/a/b?q=1#x http://foo.org ftp://server.local/path");
    setReplace("$&");
  }, [http, https, ftp, allowQuery, allowFragment, setPattern, setFlags, setTest, setReplace]);

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="text-sm font-medium">{t(locale, "re_theme_url")}</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={http} onChange={(e) => setHttp(e.target.checked)} />
          <span className="text-sm">http</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={https} onChange={(e) => setHttps(e.target.checked)} />
          <span className="text-sm">https</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ftp} onChange={(e) => setFtp(e.target.checked)} />
          <span className="text-sm">ftp</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowQuery} onChange={(e) => setAllowQuery(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_url_allow_query")}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowFragment} onChange={(e) => setAllowFragment(e.target.checked)} />
          <span className="text-sm">{t(locale, "re_url_allow_fragment")}</span>
        </label>
      </div>
    </div>
  );
}
