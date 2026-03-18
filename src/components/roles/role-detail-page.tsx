"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell/app-shell";
import { BackNavButton } from "@/components/app-shell/back-nav-button";
import { PageIntro } from "@/components/app-shell/page-intro";
import { TaskAccordionList } from "@/components/roles/task-accordion-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getRoleBenchmarkById } from "@/data/roles";
import { useCurrentBenchmarkRun } from "@/lib/session/use-current-benchmark-run";

export function RoleDetailPage({ slug }: { slug: string }) {
  const { run } = useCurrentBenchmarkRun();
  const role = run.roleResults.find((item) => item.roleId === slug) ?? null;
  const roleConfig = getRoleBenchmarkById(slug);

  if (!role || !roleConfig) {
    return (
      <AppShell>
        <BackNavButton fallbackHref="/roles" label="Back to roles" />
        <Panel>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white">
              Role not available in this run
            </h1>
            <p className="text-sm leading-6 text-slate-300">
              This session only exposes the fixed V1 role set. Return to the roles
              index and open one of the benchmarked roles.
            </p>
            <Link href="/roles">
              <Button>Back to roles</Button>
            </Link>
          </div>
        </Panel>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <BackNavButton fallbackHref="/roles" label="Back to roles" />
      <PageIntro
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/roles">
              <Button size="lg" variant="secondary">
                Back to roles
              </Button>
            </Link>
            <Link href={`/runs/${run.meta.runId}`}>
              <Button size="lg">Open run details</Button>
            </Link>
          </div>
        }
        description={role.summaryRationale}
        eyebrow={`Role detail · ${role.roleCategory}`}
        title={role.roleName}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Exposure score", `${role.exposureScore}`],
          ["Exposure band", role.exposureBand],
          ["Model tested", run.meta.model],
          ["Human dependency", role.humanDependency],
          ["Tasks evaluated", `${role.taskCount}`],
        ].map(([label, value]) => (
          <Panel className="p-5" key={label}>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              {label}
            </p>
            <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">
              {value}
            </p>
          </Panel>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="space-y-4">
          <div>
            <Badge tone="neutral">Role benchmark note</Badge>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {roleConfig.benchmarkNotes}
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Top automatable tasks
              </p>
              <div className="mt-3 space-y-2">
                {role.topAutomatableTasks.map((task) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3"
                    key={task.taskId}
                  >
                    <span className="text-sm text-slate-200">{task.title}</span>
                    <Badge tone="success">{task.score}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Weakest tasks
              </p>
              <div className="mt-3 space-y-2">
                {role.weakestTasks.map((task) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3"
                    key={task.taskId}
                  >
                    <span className="text-sm text-slate-200">{task.title}</span>
                    <Badge tone="danger">{task.score}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="space-y-5">
          <div className="space-y-2">
            <Badge tone="brand">Task list</Badge>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Compact by default, detailed on demand
            </h2>
            <p className="text-sm leading-6 text-slate-300">
              Each task starts collapsed. Expand only the tasks you want to inspect
              for rationale, strengths, weaknesses, scoring notes, and output expectations.
            </p>
          </div>
          <TaskAccordionList role={role} />
        </Panel>
      </section>
    </AppShell>
  );
}
