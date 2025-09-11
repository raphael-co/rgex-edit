
import RegexEditor from "@/components/regex/RegexEditor";
import { t, type Locale } from "@/lib/i18n";

export default async function Page({
  params
}: {
  params: Promise<{ locale: Locale}>;
}) {
  const { locale } = await params;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t(locale as Locale, "re_title")}</h1>
      <p className="opacity-80">{t(locale as Locale, "re_intro")}</p>
      <RegexEditor locale={locale as Locale} />
    </div>
  );
}