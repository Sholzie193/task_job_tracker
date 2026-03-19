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
        "neo-panel inline-flex items-center gap-2 self-start rounded-2xl px-4 py-2 text-sm text-[color:var(--text-1)] transition hover:-translate-y-0.5",
        "lg:fixed lg:left-5 lg:top-1/2 lg:z-20 lg:h-12 lg:w-12 lg:-translate-y-1/2 lg:justify-center lg:rounded-2xl lg:px-0",
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
