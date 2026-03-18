"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ScanSearch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BENCHMARK_VERSION, PRODUCT_NAME } from "@/lib/benchmark/constants";
import { cn } from "@/lib/utils";

const links = [
  { href: "/overview", label: "Overview" },
  { href: "/roles", label: "Roles" },
  { href: "/methodology", label: "Methodology" },
  { href: "/runs/latest", label: "Run Details" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-full border border-white/10 bg-slate-950/55 px-4 py-3 shadow-[0_12px_48px_-26px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_40px_-16px_rgba(34,211,238,0.9)]">
            <ScanSearch className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium tracking-[-0.03em] text-white">
              {PRODUCT_NAME}
            </p>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
              {BENCHMARK_VERSION} local lab
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white",
                  isActive && "bg-white/8 text-white",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Badge tone="neutral" className="hidden sm:inline-flex">
            OpenAI only
          </Badge>
          <Link href="/runs/latest">
            <Button size="sm" className="gap-2">
              Run benchmark
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
