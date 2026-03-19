"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "neo-surface inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] text-[color:var(--text-2)] transition hover:-translate-y-0.5 hover:text-[color:var(--text-1)]",
        className,
      )}
      onClick={toggleTheme}
      type="button"
    >
      {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </button>
  );
}
