import { AlertTriangle, DatabaseZap, Orbit, SquareDashedMousePointer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";

export function LoadingState({
  progress,
}: {
  progress: {
    percentage: number;
    completedTasks: number;
    totalTasks: number;
    activeRoleName: string;
    activeTaskTitle: string;
  };
}) {
  return (
    <Panel className="h-full">
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-100">
            <Orbit className="h-3.5 w-3.5 animate-spin" />
            Benchmark in progress
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Evaluating realistic role tasks
            </h3>
            <p className="text-sm leading-6 text-slate-300">
              The run is stepping through tasks sequentially so the resulting role
              exposure score remains interpretable instead of being a black-box summary.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <ProgressBar value={progress.percentage} />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Completed
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {progress.completedTasks} / {progress.totalTasks}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Active role
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {progress.activeRoleName}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Active task
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {progress.activeTaskTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Panel className="h-full">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-center gap-3 text-rose-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-rose-100/80">
              Run failed
            </p>
            <h3 className="text-xl font-semibold text-white">
              The benchmark did not complete cleanly
            </h3>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-300">{message}</p>
        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-400">
          Common causes in live mode are an unavailable model name, an invalid key,
          or a provider-side timeout while evaluating multiple tasks.
        </div>
        {onRetry ? (
          <div>
            <Button onClick={onRetry} variant="secondary">
              Retry benchmark
            </Button>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

export function EmptyState() {
  return (
    <Panel>
      <div className="flex flex-col items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-100">
          <DatabaseZap className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">No benchmark run yet</h3>
          <p className="max-w-xl text-sm leading-6 text-slate-300">
            Launch the runner to generate the first role exposure profile. Once a run
            completes, the dashboard will show the provider, model, version, scope,
            and detailed task-level breakdown.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm text-slate-300">
          <SquareDashedMousePointer className="h-4 w-4" />
          Session state only. No database persistence in V1.
        </div>
      </div>
    </Panel>
  );
}

