"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  LayoutDashboard,
  Rocket,
  ScanSearch,
  Users,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useCurrentBenchmarkRun } from "@/lib/session/use-current-benchmark-run";
import { cn, formatShortDate } from "@/lib/utils";

const links = [
  {
    href: "/overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/roles",
    label: "Roles",
    icon: Users,
  },
  {
    href: "/methodology",
    label: "Methodology",
    icon: FileText,
  },
  {
    href: "/runs/latest",
    label: "Run Details",
    icon: Activity,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { run, isSampleRun } = useCurrentBenchmarkRun();

  function isLinkActive(href: string) {
    if (href === "/runs/latest") {
      return pathname.startsWith("/runs/") || pathname === "/runner";
    }

    if (href === "/roles") {
      return pathname === "/roles" || pathname.startsWith("/roles/");
    }

    return pathname === href;
  }

  return (
    <aside className="hidden w-[286px] shrink-0 flex-col border-r border-[color:var(--border)] bg-[var(--sidebar-surface)] px-5 py-5 lg:flex">
      <div className="neo-panel rounded-[10px] p-4">
        <div className="flex items-center gap-3">
          <div className="neo-accent flex h-11 w-11 items-center justify-center rounded-[8px]">
            <ScanSearch className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[-0.03em] text-[color:var(--text-1)]">
              Frontier Task
            </p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--text-3)]">
              Exposure Lab
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {links.map((link) => {
          const isActive = isLinkActive(link.href);

          return (
            <Link
              className={cn(
                "group relative flex items-center gap-3 rounded-[8px] border px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "neo-nav-active border-[color:var(--border-strong)] text-[color:var(--text-1)]"
                  : "neo-surface border-[color:var(--border)] text-[color:var(--text-2)] hover:text-[color:var(--text-1)]",
              )}
              href={link.href}
              key={link.href}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
              {isActive ? (
                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="neo-panel space-y-4 rounded-[10px] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
                Current run
              </p>
              <p className="mt-2 text-sm font-medium text-[color:var(--text-1)]">
                {run.meta.model}
              </p>
            </div>
            <Badge tone={isSampleRun ? "neutral" : "success"}>
              {isSampleRun ? "Demo" : "Active"}
            </Badge>
          </div>
          <div className="grid gap-3">
            <div className="neo-inset rounded-[8px] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-3)]">
                Scope
              </p>
              <p className="mt-2 text-sm text-[color:var(--text-1)]">
                {run.meta.roleCount} roles · {run.meta.taskCount} tasks
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-[8px] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-3)]">
                  Run date
                </p>
                <p className="mt-1 text-sm text-[color:var(--text-1)]">
                  {formatShortDate(run.meta.runDate)}
                </p>
              </div>
              <Rocket className="h-4 w-4 text-[var(--accent)]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[8px] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-3">
          <div>
            <p className="text-xs font-medium text-[color:var(--text-1)]">Theme</p>
            <p className="text-xs text-[color:var(--text-3)]">Light or dark neomorphism</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
