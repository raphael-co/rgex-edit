import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { dict } from "@/lib/i18n";

const LOCALES = ["fr", "en"] as const;
type Locale = (typeof LOCALES)[number];

async function detectLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) return cookie;

  const headerStore = await headers();
  const al = headerStore.get("accept-language") || "";
  const first = al.split(",")[0]?.trim().toLowerCase();
  return first?.startsWith("fr") ? "fr" : "en";
}

export async function GET() {
  const locale = await detectLocale();
  return NextResponse.json({ message: dict[locale].api });
}
