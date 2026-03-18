"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { RoleExposureResult } from "@/lib/benchmark/types";

export function RoleDetailSheet({
  role,
  model,
  onClose,
}: {
  role: RoleExposureResult | null;
  model: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {role ? (
        <>
          <motion.button
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-y-4 right-4 z-50 w-[calc(100%-2rem)] max-w-xl"
            exit={{ opacity: 0, x: 24 }}
            initial={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Panel className="flex h-full flex-col overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    Role detail panel
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {role.roleName}
                  </h3>
                </div>
                <Button onClick={onClose} size="sm" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{role.exposureScore}</Badge>
                    <Badge tone="neutral">{role.exposureBand}</Badge>
                    <Badge tone="neutral">{model}</Badge>
                    <Badge tone="neutral">{role.taskCount} tasks evaluated</Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    {role.summaryRationale}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Automation
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {role.averageAutomation}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Autonomy
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {role.averageAutonomy}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        Human dependency
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        {role.humanDependency}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Top automatable tasks
                      </p>
                      <div className="mt-4 space-y-3">
                        {role.topAutomatableTasks.map((task) => (
                          <div
                            className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
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

                    <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Weakest tasks
                      </p>
                      <div className="mt-4 space-y-3">
                        {role.weakestTasks.map((task) => (
                          <div
                            className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
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

                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Human dependency note
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {role.humanDependency === "High"
                          ? "This role still depends heavily on human intervention because the final mile involves field execution, contextual judgment, or safety-sensitive accountability."
                          : role.humanDependency === "Medium"
                            ? "The model can absorb a meaningful share of the workflow, but a human still improves prioritization quality, exception handling, and final accountability."
                            : "The remaining human role is mostly review and sign-off rather than deep execution for the best-performing tasks in this role."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

