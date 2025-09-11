"use client";

import { t, type Locale } from "@/lib/i18n";

export default function Cheatsheet({ locale }: { locale: Locale }) {
  return (
    <div className="rounded-2xl border p-4 space-y-2">
      <details>
        <summary className="cursor-pointer select-none font-medium">
          {t(locale, "re_cheatsheet")}
        </summary>
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
  );
}
