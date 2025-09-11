

import type { Metadata } from "next";
import Header from "@/components/Header";
import { LOCALES } from "@/lib/i18n";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

    </>
  );
}
