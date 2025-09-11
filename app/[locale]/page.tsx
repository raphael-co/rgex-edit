import { t, type Locale } from "@/lib/i18n";
import DemoChart from "@/components/DemoChart";
import ApiMessage from "@/components/ApiMessage";

export default async function Page({ params }: { params: Promise<{ locale: "en" | "fr" }>; }) {

  const { locale } = await params;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t(locale, "title")}</h1>
      <p className="opacity-80">{t(locale, "intro")}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <DemoChart title={t(locale, "chartTitle")} />
        <ApiMessage />
      </div>
    </div>
  );
}
