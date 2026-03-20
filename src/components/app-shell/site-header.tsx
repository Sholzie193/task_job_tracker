"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Activity, FileText, LayoutDashboard, Users } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
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

const sectionMeta = {
  "/overview": {
    title: "Overview",
    description: "Current run",
    icon: LayoutDashboard,
  },
  "/roles": {
    title: "Roles",
    description: "Role index",
    icon: Users,
  },
  "/methodology": {
    title: "Methodology",
    description: "Reading guide",
    icon: FileText,
  },
  "/runs": {
    title: "Run Details",
    description: "Runner and metadata",
    icon: Activity,
  },
} as const;

export function SiteHeader() {
  const pathname = usePathname();
  function isLinkActive(href: string) {
    if (href === "/runs/latest") {
      return pathname.startsWith("/runs/") || pathname === "/runner";
    }

    if (href === "/roles") {
      return pathname === "/roles" || pathname.startsWith("/roles/");
    }

    return pathname === href;
  }

  const currentSection =
    pathname.startsWith("/roles")
      ? sectionMeta["/roles"]
      : pathname.startsWith("/methodology")
        ? sectionMeta["/methodology"]
        : pathname.startsWith("/runs") || pathname.startsWith("/runner")
          ? sectionMeta["/runs"]
          : sectionMeta["/overview"];
  const SectionIcon = currentSection.icon;

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="neo-panel mx-auto flex max-w-[1480px] flex-col gap-4 rounded-[10px] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="neo-surface flex h-11 w-11 items-center justify-center rounded-[8px] border border-[color:var(--border)] text-[var(--accent)]">
            <SectionIcon className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-sm font-medium tracking-[-0.03em] text-[color:var(--text-1)]">
              {currentSection.title}
            </p>
            <p className="mt-0.5 text-xs uppercase tracking-[0.22em] text-[color:var(--text-3)]">
              {currentSection.description}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 lg:hidden">
          {links.map((link) => {
            const isActive = isLinkActive(link.href);

            return (
              <Link
                className={cn(
                  "rounded-[8px] border px-3 py-2 text-sm transition",
                  isActive
                    ? "neo-nav-active border-[color:var(--border-strong)] text-[color:var(--text-1)]"
                    : "border-[color:var(--border)] bg-[var(--surface-soft)] text-[color:var(--text-2)] hover:text-[color:var(--text-1)]",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Link className="hidden lg:block" href="/overview">
            <div className="rounded-[8px] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-2.5">
              <p className="text-xs font-medium text-[color:var(--text-1)]">{PRODUCT_NAME}</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-3)]">
                {BENCHMARK_VERSION} local lab
              </p>
            </div>
          </Link>
          <Badge tone="neutral" className="hidden sm:inline-flex">
            OpenAI + Anthropic
          </Badge>
          <ThemeToggle />
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
