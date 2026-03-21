"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell/app-shell";
import { BackNavButton } from "@/components/app-shell/back-nav-button";
import { PageIntro } from "@/components/app-shell/page-intro";
import { BenchmarkControlPanel } from "@/components/benchmark/benchmark-control-panel";
import { RecentRunCard } from "@/components/dashboard/recent-run-card";
import { ResultMetaStrip } from "@/components/dashboard/result-meta-strip";
import { ShareResultCard } from "@/components/dashboard/share-result-card";
import { ErrorState, LoadingState } from "@/components/dashboard/states";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getDefaultModelForProvider } from "@/data/model-options";
import { BENCHMARK_TASK_COUNT, roleBenchmarks } from "@/data/roles";
import type {
  BenchmarkMode,
  BenchmarkProvider,
  BenchmarkRunResult,
  RunBenchmarkRequest,
} from "@/lib/benchmark/types";
import { useCurrentBenchmarkRun } from "@/lib/session/use-current-benchmark-run";

const benchmarkSequence = roleBenchmarks.flatMap((role) =>
  role.tasks.map((task) => ({
    roleName: role.name,
    taskTitle: task.title,
  })),
);

export function RunDetailsPage({ runId }: { runId: string }) {
  const { run, isSampleRun, resetToSampleRun, setCurrentRun } = useCurrentBenchmarkRun();
  const [provider, setProvider] = useState<BenchmarkProvider>(run.meta.provider);
  const [mode, setMode] = useState<BenchmarkMode>("mock");
  const [modelPreset, setModelPreset] = useState(run.meta.model);
  const [customModel, setCustomModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [completedTasks, setCompletedTasks] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setProvider(run.meta.provider);
    setModelPreset(run.meta.model);
  }, [run.meta.model, run.meta.provider]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const effectiveModel = customModel.trim() || modelPreset;
  const progressIndex = Math.min(
    Math.max(completedTasks - 1, 0),
    benchmarkSequence.length - 1,
  );
  const activeProgressStep = benchmarkSequence[progressIndex] ?? benchmarkSequence[0];
  const requestedRunMatches = runId === "latest" || runId === run.meta.runId;

  function stopProgressInterval() {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }

  function startProgressInterval() {
    stopProgressInterval();
    setCompletedTasks(1);

    progressIntervalRef.current = window.setInterval(() => {
      setCompletedTasks((current) => Math.min(current + 1, BENCHMARK_TASK_COUNT - 4));
    }, 160);
  }

  async function runBenchmark() {
    setStatus("running");
    setErrorMessage("");
    startProgressInterval();

    try {
      const body: RunBenchmarkRequest = {
        provider,
        model: effectiveModel,
        mode,
        apiKey: apiKey.trim() || undefined,
      };

      const response = await fetch("/api/benchmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const payload = (await response.json()) as {
        run?: BenchmarkRunResult;
        error?: string;
      };

      if (!response.ok || !payload.run) {
        throw new Error(payload.error || "The benchmark could not be completed.");
      }

      stopProgressInterval();
      setCompletedTasks(BENCHMARK_TASK_COUNT);
      setCurrentRun(payload.run);
      setStatus("idle");
    } catch (error) {
      stopProgressInterval();
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The benchmark could not be completed.",
      );
    }
  }

  return (
    <AppShell>
      <BackNavButton fallbackHref="/overview" label="Back to overview" />
      <PageIntro
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/overview">
              <Button size="lg" variant="secondary">
                Overview
              </Button>
            </Link>
            <Link href="/roles">
              <Button size="lg">Roles</Button>
            </Link>
          </div>
        }
        description="Run, inspect, replace."
        eyebrow={isSampleRun ? "Demo baseline" : "Run details"}
        title="Benchmark run"
      />

      {!requestedRunMatches ? (
        <Panel className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-1)]">
                Requested run not in session storage
              </h2>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-2)]">
                V1 only keeps the current session run locally. Open the latest available
                run instead of an older historical id.
              </p>
            </div>
            <Link href={`/runs/${run.meta.runId}`}>
              <Button>Open current run</Button>
            </Link>
          </div>
        </Panel>
      ) : null}

      <ResultMetaStrip isSampleRun={isSampleRun} run={run} />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <BenchmarkControlPanel
          apiKey={apiKey}
          customModel={customModel}
          isRunning={status === "running"}
          mode={mode}
          modelPreset={modelPreset}
          onApiKeyChange={setApiKey}
          onClearKey={() => setApiKey("")}
          onCustomModelChange={setCustomModel}
          onModeChange={setMode}
          onProviderChange={(nextProvider) => {
            setProvider(nextProvider);
            setModelPreset(getDefaultModelForProvider(nextProvider));
            setCustomModel("");
            setApiKey("");
          }}
          onModelPresetChange={setModelPreset}
          onResetSession={resetToSampleRun}
          onRun={runBenchmark}
          onToggleKeyVisibility={() => setShowKey((current) => !current)}
          provider={provider}
          showKey={showKey}
        />
        {status === "running" ? (
          <LoadingState
            progress={{
              percentage: Math.round((completedTasks / BENCHMARK_TASK_COUNT) * 100),
              completedTasks,
              totalTasks: BENCHMARK_TASK_COUNT,
              activeRoleName: activeProgressStep.roleName,
              activeTaskTitle: activeProgressStep.taskTitle,
            }}
          />
        ) : status === "error" ? (
          <ErrorState message={errorMessage} onRetry={runBenchmark} />
        ) : (
          <RecentRunCard isSampleRun={isSampleRun} run={run} />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ShareResultCard run={run} />
        <Panel className="space-y-4 p-5">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-[color:var(--text-1)]">
            Run navigation
          </h2>
          <p className="text-sm leading-6 text-[color:var(--text-2)]">Move by surface.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/overview">
              <div className="neo-inset rounded-[6px] p-4 text-sm text-[color:var(--text-1)] transition hover:-translate-y-0.5">
                Overview
              </div>
            </Link>
            <Link href="/roles">
              <div className="neo-inset rounded-[6px] p-4 text-sm text-[color:var(--text-1)] transition hover:-translate-y-0.5">
                Roles
              </div>
            </Link>
            <Link href="/methodology">
              <div className="neo-inset rounded-[6px] p-4 text-sm text-[color:var(--text-1)] transition hover:-translate-y-0.5">
                Methodology
              </div>
            </Link>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
