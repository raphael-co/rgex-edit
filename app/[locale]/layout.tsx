

import type { Metadata } from "next";
import Header from "@/components/Header";
import { LOCALES } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "github-next-tsx-template",
  description: "Next.js 15 + TS GitHub-ready template",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "fr" | "en" }>;
}) {

  const { locale } = await params;
  const lang = LOCALES.includes(locale) ? locale : "en";
  return (
    <>
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

    </>
  );
}
