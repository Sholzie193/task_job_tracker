import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getTaskConfigById } from "@/data/roles";
import type { RoleExposureResult } from "@/lib/benchmark/types";

const dependencyTone = {
  Low: "success",
  Medium: "warning",
  High: "danger",
} as const;

const statusTone = {
  Automatable: "success",
  Assisted: "warning",
  "Human-led": "danger",
} as const;

export function TaskAccordionList({ role }: { role: RoleExposureResult }) {
  return (
    <div className="space-y-3">
      {role.tasks.map((task) => {
        const taskConfig = getTaskConfigById(role.roleId, task.taskId);

        return (
          <details
            className="group rounded-3xl border border-white/10 bg-slate-950/42"
            key={task.taskId}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone[task.status]}>{task.status}</Badge>
                  <Badge tone={dependencyTone[task.humanDependency]}>
                    Human dependency {task.humanDependency}
                  </Badge>
                </div>
                <h3 className="text-lg font-medium tracking-[-0.03em] text-white">
                  {task.taskTitle}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>Score {task.combinedScore}</span>
                  <span>Automation {task.taskAutomationConfidence}</span>
                  <span>Autonomy {task.autonomyConfidence}</span>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-white/10 px-5 py-5">
              <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Task description
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {task.taskDescription}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Rationale
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{task.reasoning}</p>
                  </div>
                  {taskConfig ? (
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Extra notes
                      </p>
                      <div className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                        <p>Difficulty: {taskConfig.difficulty}</p>
                        <p>Expected output: {taskConfig.expectedOutputType}</p>
                        <p>{taskConfig.scoringNotes}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Strengths
                    </p>
                    <div className="mt-3 space-y-2">
                      {task.strengths.map((strength) => (
                        <div
                          className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm leading-6 text-slate-300"
                          key={strength}
                        >
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Weaknesses
                    </p>
                    <div className="mt-3 space-y-2">
                      {task.weaknesses.map((weakness) => (
                        <div
                          className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm leading-6 text-slate-300"
                          key={weakness}
                        >
                          {weakness}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}

