"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AppShell } from "@/components/app-shell/app-shell";
import { PageIntro } from "@/components/app-shell/page-intro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useCurrentBenchmarkRun } from "@/lib/session/use-current-benchmark-run";

export function RolesPage() {
  const { run, isSampleRun } = useCurrentBenchmarkRun();
  const roles = [...run.roleResults].sort(
    (left, right) => right.exposureScore - left.exposureScore,
  );

  return (
    <AppShell>
      <PageIntro
        action={
          <Link href={`/runs/${run.meta.runId}`}>
            <Button size="lg">Open current run</Button>
          </Link>
        }
        description="Each role has a dedicated detail page. Open a role to see compact task summaries first, then expand individual tasks only when you want the rationale and caveats."
        eyebrow={isSampleRun ? "Roles · demo baseline" : "Roles"}
        title="Explore role exposure one role at a time."
      />

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <Link href={`/roles/${role.roleId}`} key={role.roleId}>
            <Panel className="h-full p-5 transition hover:-translate-y-1">
              <div className="flex h-full flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Badge tone="neutral">{role.roleCategory}</Badge>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-1)]">
                      {role.roleName}
                    </h2>
                  </div>
                  <Badge tone="brand">{role.exposureScore}</Badge>
                </div>
                <p className="text-sm leading-6 text-[color:var(--text-2)]">
                  {role.summaryRationale}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="neo-inset rounded-2xl p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-3)]">
                      Band
                    </p>
                    <p className="mt-2 text-sm font-medium text-[color:var(--text-1)]">
                      {role.exposureBand}
                    </p>
                  </div>
                  <div className="neo-inset rounded-2xl p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-3)]">
                      Automation
                    </p>
                    <p className="mt-2 text-sm font-medium text-[color:var(--text-1)]">
                      {role.averageAutomation}
                    </p>
                  </div>
                  <div className="neo-inset rounded-2xl p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-3)]">
                      Autonomy
                    </p>
                    <p className="mt-2 text-sm font-medium text-[color:var(--text-1)]">
                      {role.averageAutonomy}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between text-sm text-[color:var(--text-3)]">
                  <span>{role.taskCount} tasks</span>
                  <span className="inline-flex items-center gap-2 text-[var(--accent)]">
                    Open detail
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Panel>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
