"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell/app-shell";
import { PageIntro } from "@/components/app-shell/page-intro";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ExposureBarChart } from "@/components/visualizations/exposure-bar-chart";
import { ExposureMatrix } from "@/components/visualizations/exposure-matrix";
import { useCurrentBenchmarkRun } from "@/lib/session/use-current-benchmark-run";
import { formatRunDate } from "@/lib/utils";

export function OverviewPage() {
  const { run, isSampleRun } = useCurrentBenchmarkRun();
  const highestRole = run.highestExposureRoles[0];
  const lowestRole = run.lowestExposureRoles[0];

  const overviewCards = [
    ["Model tested", run.meta.model],
    ["Benchmark version", run.meta.benchmarkVersion],
    ["Run date", formatRunDate(run.meta.runDate)],
    ["Roles tested", `${run.meta.roleCount}`],
    ["Tasks tested", `${run.meta.taskCount}`],
    ["Overall exposure", `${run.overallAverageExposure}`],
    ["Highest exposure role", highestRole.roleName],
    ["Lowest exposure role", lowestRole.roleName],
  ];

  return (
    <AppShell>
      <PageIntro
        action={
          <div className="flex flex-wrap gap-3">
            <Link href={`/runs/${run.meta.runId}`}>
              <Button size="lg">Run details</Button>
            </Link>
            <Link href="/roles">
              <Button size="lg" variant="secondary">
                Roles
              </Button>
            </Link>
          </div>
        }
        description="Current benchmark at a glance."
        eyebrow={isSampleRun ? "Overview · demo" : "Overview"}
        title="Current benchmark"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(([label, value]) => (
          <Panel className="p-4" key={label}>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
              {label}
            </p>
            <p className="mt-2.5 text-xl font-medium tracking-[-0.04em] text-[color:var(--text-1)]">
              {value}
            </p>
          </Panel>
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
    </AppShell>
  );
}
