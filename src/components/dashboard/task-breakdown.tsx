import { ArrowRight, Bot, Gauge, ShieldHalf } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeading } from "@/components/ui/section-heading";
import type { RoleExposureResult } from "@/lib/benchmark/types";

const humanDependencyTone = {
  Low: "success",
  Medium: "warning",
  High: "danger",
} as const;

const statusTone = {
  "Automatable": "success",
  Assisted: "warning",
  "Human-led": "danger",
} as const;

export function TaskBreakdown({
  role,
  model,
}: {
  role: RoleExposureResult | null;
  model: string;
}) {
  if (!role) {
    return null;
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        eyebrow="Task Breakdown"
        title={`${role.roleName} task-level benchmark`}
        description="Each task records automation confidence, autonomy confidence, a concise rationale, and where human dependency still dominates."
      />
      <Panel className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Selected role
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {role.roleName}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {role.summaryRationale}
                </p>
              </div>
              <Badge tone="brand">{role.exposureScore}</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Model tested
                </p>
                <p className="mt-2 text-sm font-medium text-white">{model}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Human dependency
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {role.humanDependency}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Tasks evaluated
                </p>
                <p className="mt-2 text-sm font-medium text-white">{role.taskCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Top automatable tasks
                </p>
                <div className="mt-4 space-y-3">
                  {role.topAutomatableTasks.map((task) => (
                    <div
                      className="rounded-2xl border border-white/10 bg-white/6 p-4"
                      key={task.taskId}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-white">{task.title}</p>
                        <Badge tone="success">{task.score}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {task.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Weakest tasks
                </p>
                <div className="mt-4 space-y-3">
                  {role.weakestTasks.map((task) => (
                    <div
                      className="rounded-2xl border border-white/10 bg-white/6 p-4"
                      key={task.taskId}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-white">{task.title}</p>
                        <Badge tone="danger">{task.score}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {task.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {role.tasks.map((task) => (
            <div
              className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
              key={task.taskId}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={statusTone[task.status]}>{task.status}</Badge>
                    <Badge tone={humanDependencyTone[task.humanDependency]}>
                      Human dependency {task.humanDependency}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-medium tracking-[-0.03em] text-white">
                    {task.taskTitle}
                  </h4>
                  <p className="text-sm leading-6 text-slate-400">
                    {task.taskDescription}
                  </p>
                </div>
                <Badge tone="brand">{task.combinedScore}</Badge>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-200">
                      <Bot className="h-4 w-4 text-cyan-200" />
                      Automation confidence
                    </div>
                    <span className="text-sm font-medium text-white">
                      {task.taskAutomationConfidence}
                    </span>
                  </div>
                  <ProgressBar className="mt-3" value={task.taskAutomationConfidence} />
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-200">
                      <Gauge className="h-4 w-4 text-cyan-200" />
                      Autonomy confidence
                    </div>
                    <span className="text-sm font-medium text-white">
                      {task.autonomyConfidence}
                    </span>
                  </div>
                  <ProgressBar className="mt-3" value={task.autonomyConfidence} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                    <ShieldHalf className="h-3.5 w-3.5" />
                    Rationale
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{task.reasoning}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Strengths
                    </p>
                    <div className="mt-3 space-y-2">
                      {task.strengths.map((strength) => (
                        <div
                          className="flex items-start gap-2 text-sm leading-6 text-slate-300"
                          key={strength}
                        >
                          <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-200" />
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Weaknesses
                    </p>
                    <div className="mt-3 space-y-2">
                      {task.weaknesses.map((weakness) => (
                        <div
                          className="flex items-start gap-2 text-sm leading-6 text-slate-300"
                          key={weakness}
                        >
                          <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-200" />
                          <span>{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

