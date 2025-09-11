import "@/app/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LOCALES, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "github-next-tsx-template",
  description: "Next.js 15 + TS GitHub-ready template"
};

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const lang = LOCALES.includes(locale) ? locale : "en";

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
