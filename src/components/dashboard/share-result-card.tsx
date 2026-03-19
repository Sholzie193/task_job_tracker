import { CopyCheck, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { BenchmarkRunResult } from "@/lib/benchmark/types";
import { formatShortDate } from "@/lib/utils";

export function ShareResultCard({ run }: { run: BenchmarkRunResult }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Badge tone="neutral">Shareable card</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-1)]">
            Screenshot-ready result block
          </h2>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[color:var(--text-2)] md:flex">
          <Share2 className="h-4 w-4" />
          Export image later
        </div>
      </div>
      <Panel className="relative overflow-hidden [background:linear-gradient(145deg,color-mix(in_srgb,var(--surface-1)_92%,white_4%),color-mix(in_srgb,var(--surface-2)_88%,var(--accent-soft)))]">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[var(--accent)] to-transparent" />
        <div className="space-y-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Badge tone="brand">Frontier Task Exposure Lab</Badge>
              <div>
                <p className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-1)]">
                  {run.meta.model}
                </p>
                <p className="mt-2 text-sm text-[color:var(--text-2)]">
                  Role Exposure Benchmark {run.meta.benchmarkVersion} ·{" "}
                  {formatShortDate(run.meta.runDate)}
                </p>
              </div>
            </div>
            <div className="neo-inset rounded-3xl px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
                Overall exposure
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--text-1)]">
                {run.overallAverageExposure}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--accent)_26%,transparent)] bg-[color:var(--accent-soft)] p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--text-1)]">
                <CopyCheck className="h-3.5 w-3.5" />
                Highest exposure roles
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {run.highestExposureRoles.map((role) => (
                  <span
                    className="rounded-full border border-[color:var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--text-1)]"
                    key={role.roleId}
                  >
                    {role.roleName} · {role.exposureScore}
                  </span>
                ))}
              </div>
            </div>
            <div className="neo-inset rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--text-3)]">
                Lowest exposure roles
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {run.lowestExposureRoles.map((role) => (
                  <span
                    className="rounded-full border border-[color:var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--text-1)]"
                    key={role.roleId}
                  >
                    {role.roleName} · {role.exposureScore}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </section>
  );
}
