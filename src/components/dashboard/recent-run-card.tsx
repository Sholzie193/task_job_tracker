import { Clock3, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { BenchmarkRunResult } from "@/lib/benchmark/types";
import { formatRunDate } from "@/lib/utils";

export function RecentRunCard({
  run,
  isSampleRun,
}: {
  run: BenchmarkRunResult;
  isSampleRun: boolean;
}) {
  const highestRole = run.highestExposureRoles[0];
  const lowestRole = run.lowestExposureRoles[0];

  return (
    <Panel className="h-full">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <Badge tone="neutral">Recent run summary</Badge>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--text-3)]">
            <Clock3 className="h-3.5 w-3.5" />
            {formatRunDate(run.meta.runDate)}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-1)]">
            {run.meta.model} mapped strongest into
            <span className="text-[var(--accent)]"> {highestRole.roleName}</span>.
          </h3>
          <p className="max-w-xl text-sm leading-6 text-[color:var(--text-2)]">
            {isSampleRun
              ? "This dashboard starts with a polished mock baseline so the lab is usable immediately. Run your own benchmark to overwrite it for the current session."
              : "Your latest session result is active. The view below reflects the exact provider, model, version, and role/task scope from that run."}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="neo-inset rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--text-3)]">
              <Sparkles className="h-3.5 w-3.5" />
              Highest exposure
            </div>
            <p className="mt-3 text-lg font-medium text-[color:var(--text-1)]">{highestRole.roleName}</p>
            <p className="mt-1 text-sm text-[color:var(--text-3)]">
              {highestRole.exposureScore} · {highestRole.exposureBand}
            </p>
          </div>
          <div className="neo-inset rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--text-3)]">
              <Target className="h-3.5 w-3.5" />
              Lowest exposure
            </div>
            <p className="mt-3 text-lg font-medium text-[color:var(--text-1)]">{lowestRole.roleName}</p>
            <p className="mt-1 text-sm text-[color:var(--text-3)]">
              {lowestRole.exposureScore} · {lowestRole.exposureBand}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
