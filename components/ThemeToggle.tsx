"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border px-2 py-1 text-sm">
      <button className="p-1 rounded" onClick={() => setTheme("light")} title="Light">
        <Sun className="h-4 w-4" />
      </button>
      <button className="p-1 rounded" onClick={() => setTheme("dark")} title="Dark">
        <Moon className="h-4 w-4" />
      </button>
      <button className="p-1 rounded" onClick={() => setTheme("system")} title="System">
        <Laptop className="h-4 w-4" />
      </button>
      <span className="ml-2 opacity-70">{theme}</span>
    </div>
  );
}
