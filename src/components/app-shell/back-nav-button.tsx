"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export function BackNavButton({
  fallbackHref,
  label = "Back",
  className,
}: {
  fallbackHref: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10",
        "lg:fixed lg:left-6 lg:top-1/2 lg:z-20 lg:h-12 lg:w-12 lg:-translate-y-1/2 lg:justify-center lg:rounded-full lg:px-0",
        className,
      )}
      onClick={handleBack}
      type="button"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      <span className="lg:hidden">{label}</span>
    </button>
  );
}

