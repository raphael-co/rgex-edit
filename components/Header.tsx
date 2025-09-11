import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { Film } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          <span className="font-semibold">github-next-tsx-template</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
