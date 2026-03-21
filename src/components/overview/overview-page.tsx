"use client";

import Link from "next/link";
import { ArrowRight, Orbit, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell/app-shell";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ExposureBarChart } from "@/components/visualizations/exposure-bar-chart";
import { ExposureMatrix } from "@/components/visualizations/exposure-matrix";
import { getProviderLabel } from "@/lib/benchmark/provider";
import { useCurrentBenchmarkRun } from "@/lib/session/use-current-benchmark-run";
import { formatRunDate } from "@/lib/utils";

export function OverviewPage() {
  const { run, isSampleRun } = useCurrentBenchmarkRun();
  const highestRole = run.highestExposureRoles[0];
  const lowestRole = run.lowestExposureRoles[0];
  const providerLabel = getProviderLabel(run.meta.provider);

  const overviewCards = [
    ["Run date", formatRunDate(run.meta.runDate)],
    ["Scope", `${run.meta.roleCount} roles · ${run.meta.taskCount} tasks`],
    ["High", highestRole.roleName],
    ["Low", lowestRole.roleName],
  ];

  return (
    <AppShell>
      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
              <Orbit className="h-3.5 w-3.5 text-[var(--accent)]" />
              {isSampleRun ? "Demo baseline" : "Overview"}
            </span>
          </div>
          <div className="space-y-4">
            <p className="text-[12px] uppercase tracking-[0.3em] text-[color:var(--text-3)]">
              {providerLabel} · {run.meta.model}
            </p>
            <h1 className="max-w-4xl text-5xl font-medium tracking-[-0.08em] text-[color:var(--text-1)] sm:text-6xl">
              Role exposure benchmark.
            </h1>
            <p className="max-w-2xl text-base text-[color:var(--text-2)]">
              Current run at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/runs/${run.meta.runId}`}>
              <Button size="lg">Run details</Button>
            </Link>
            <Link href="/roles">
              <Button size="lg" variant="secondary">
                View roles
              </Button>
            </Link>
          </div>
        </div>

        <Panel className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
              Overall exposure
            </p>
            <div className="flex items-end gap-4">
              <p className="text-7xl font-medium tracking-[-0.09em] text-[color:var(--text-1)]">
                {run.overallAverageExposure}
              </p>
              <div className="space-y-1 pb-2">
                <p className="text-sm text-[color:var(--text-2)]">
                  {run.meta.benchmarkVersion}
                </p>
                <p className="text-sm text-[color:var(--text-3)]">
                  {highestRole.roleName} leads
                </p>
              </div>
            </div>
            <div className="grid gap-2 border-t border-[color:var(--border)] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--text-3)]">Highest</span>
                <span className="text-[color:var(--text-1)]">
                  {highestRole.roleName} · {highestRole.exposureScore}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--text-3)]">Lowest</span>
                <span className="text-[color:var(--text-1)]">
                  {lowestRole.roleName} · {lowestRole.exposureScore}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden h-full w-px bg-[color:var(--border)] sm:block" />
        </Panel>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(([label, value]) => (
          <div
            className="hover-halo rounded-[6px] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-4"
            key={label}
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
              {label}
            </p>
            <p className="mt-2 text-base font-medium tracking-[-0.03em] text-[color:var(--text-1)]">
              {value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ExposureMatrix
          getHref={(roleId) => `/roles/${roleId}`}
          roles={run.roleResults}
          selectedRoleId={null}
        />
        <ExposureBarChart run={run} />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 border-t border-[color:var(--border)] pt-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-3)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Benchmark metadata
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="neo-inset rounded-[6px] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-3)]">
                Provider
              </p>
              <p className="mt-2 text-base font-medium text-[color:var(--text-1)]">
                {providerLabel}
              </p>
            </div>
            <div className="neo-inset rounded-[6px] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-3)]">
                Model
              </p>
              <p className="mt-2 text-base font-medium text-[color:var(--text-1)]">
                {run.meta.model}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-[color:var(--border)] pt-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-3)]">
              Next
            </p>
            <p className="mt-2 text-base text-[color:var(--text-1)]">
              Drill into roles or inspect the run.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/roles">
              <Button variant="ghost">
                Roles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/runs/${run.meta.runId}`}>
              <Button variant="ghost">
                Run
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
