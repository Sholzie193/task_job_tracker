import {
  ArrowDownRight,
  ArrowUpRight,
  Layers3,
  ShieldCheck,
} from "lucide-react";

import { Panel } from "@/components/ui/panel";
import type { BenchmarkRunResult } from "@/lib/benchmark/types";

const categoryLabels = {
  "white-collar": "White-collar",
  hybrid: "Hybrid",
  physical: "Physical",
} as const;

export function StatsGrid({ run }: { run: BenchmarkRunResult }) {
  const highestRole = run.highestExposureRoles[0];
  const lowestRole = run.lowestExposureRoles[0];
  const strongestCategory = [...run.categoryExposure].sort(
    (left, right) => right.exposureScore - left.exposureScore,
  )[0];

  const cards = [
    {
      label: "Overall average exposure",
      value: `${run.overallAverageExposure}`,
      meta: "Aggregate role exposure score",
      icon: Layers3,
    },
    {
      label: "Highest exposure role",
      value: highestRole.roleName,
      meta: `${highestRole.exposureScore} · ${highestRole.exposureBand}`,
      icon: ArrowUpRight,
    },
    {
      label: "Lowest exposure role",
      value: lowestRole.roleName,
      meta: `${lowestRole.exposureScore} · ${lowestRole.exposureBand}`,
      icon: ArrowDownRight,
    },
    {
      label: "Average autonomy",
      value: `${run.averageAutonomy}`,
      meta: `${run.totalAutomatableTasks} tasks scored automatable`,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Panel className="p-5" key={card.label}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                {card.label}
              </p>
              <div className="space-y-1">
                <p className="text-xl font-semibold tracking-[-0.04em] text-white">
                  {card.value}
                </p>
                <p className="text-sm text-slate-400">{card.meta}</p>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-100">
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </Panel>
      ))}
      <Panel className="lg:col-span-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Category signal
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {categoryLabels[strongestCategory.category]} work is the most exposed
              in this run, reflecting how text-native structured tasks are evaluated
              relative to embodied work.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {run.categoryExposure.map((item) => (
              <div
                className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm text-slate-200"
                key={item.category}
              >
                {categoryLabels[item.category]} · {item.exposureScore}
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  );
}

