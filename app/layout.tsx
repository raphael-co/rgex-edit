import "@/app/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cookies, headers } from "next/headers";

export const metadata: Metadata = {
  title: "Regex editor",
  description: "Online regex tester and editor"
};

export default async function RootLayout({
 children
}: {
 children: React.ReactNode;
}) {
 const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value as Locale | undefined;
 let lang: Locale = "en";
 if (cookieLocale && LOCALES.includes(cookieLocale)) {
   lang = cookieLocale;
 } else {
   const al = (await headers()).get("accept-language") || "";
   const first = al.split(",")[0]?.trim().toLowerCase();
   lang = (first?.startsWith("fr") ? "fr" : "en") as Locale;
 }

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
