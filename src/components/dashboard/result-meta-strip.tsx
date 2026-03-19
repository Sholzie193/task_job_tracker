import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { BENCHMARK_NAME } from "@/lib/benchmark/constants";
import { getProviderLabel } from "@/lib/benchmark/provider";
import type { BenchmarkRunResult } from "@/lib/benchmark/types";
import { formatRunDate } from "@/lib/utils";

export function ResultMetaStrip({
  run,
  isSampleRun,
}: {
  run: BenchmarkRunResult;
  isSampleRun: boolean;
}) {
  const providerLabel = getProviderLabel(run.meta.provider);

  return (
    <Panel className="relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 hidden w-80 bg-linear-to-l from-[color:var(--accent-soft)] to-transparent lg:block" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="brand">{run.meta.mode === "live" ? "Live Run" : "Mock Run"}</Badge>
            {isSampleRun ? <Badge tone="neutral">Demo baseline</Badge> : null}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-1)] sm:text-4xl">
              {providerLabel} {run.meta.model}
            </h2>
            <p className="text-base text-[color:var(--text-2)]">
              {BENCHMARK_NAME} {run.meta.benchmarkVersion}
            </p>
            <p className="text-sm text-[color:var(--text-3)]">
              {run.meta.roleCount} roles · {run.meta.taskCount} tasks · Run on{" "}
              {formatRunDate(run.meta.runDate)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ["Provider", providerLabel],
            ["Model", run.meta.model],
            ["Version", run.meta.benchmarkVersion],
            ["Run date", formatRunDate(run.meta.runDate)],
            ["Scope", `${run.meta.roleCount} roles · ${run.meta.taskCount} tasks`],
          ].map(([label, value]) => (
            <div
              className="neo-inset rounded-2xl p-4"
              key={label}
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-3)]">
                {label}
              </p>
              <p className="mt-2 text-sm font-medium text-[color:var(--text-1)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
