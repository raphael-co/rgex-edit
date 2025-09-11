"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";

function replaceLocaleInPath(path: string, next: Locale) {
  const segs = path.split("/");
  if (segs[0] != "") segs.unshift("");
  if (LOCALES.includes(segs[1] as Locale)) segs[1] = next; else segs.splice(1, 0, next);
  return segs.join("/") || `/${next}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border px-2 py-1 text-sm">
      {LOCALES.map((lng) => (
        <button
          key={lng}
          onClick={() => router.push(replaceLocaleInPath(pathname || "/", lng) as any)}
          className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
