"use client";

import { Eye, EyeOff, KeyRound, RotateCcw, Shield, Sparkles } from "lucide-react";

import { getProviderModelOptions } from "@/data/model-options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { BENCHMARK_SECURITY_NOTE, BENCHMARK_VERSION } from "@/lib/benchmark/constants";
import { getApiKeyPlaceholder, getProviderLabel } from "@/lib/benchmark/provider";
import type { BenchmarkMode, BenchmarkProvider } from "@/lib/benchmark/types";

export function BenchmarkControlPanel({
  mode,
  provider,
  modelPreset,
  customModel,
  apiKey,
  showKey,
  isRunning,
  onModeChange,
  onProviderChange,
  onModelPresetChange,
  onCustomModelChange,
  onApiKeyChange,
  onToggleKeyVisibility,
  onRun,
  onClearKey,
  onResetSession,
}: {
  mode: BenchmarkMode;
  provider: BenchmarkProvider;
  modelPreset: string;
  customModel: string;
  apiKey: string;
  showKey: boolean;
  isRunning: boolean;
  onModeChange: (mode: BenchmarkMode) => void;
  onProviderChange: (provider: BenchmarkProvider) => void;
  onModelPresetChange: (model: string) => void;
  onCustomModelChange: (model: string) => void;
  onApiKeyChange: (value: string) => void;
  onToggleKeyVisibility: () => void;
  onRun: () => void;
  onClearKey: () => void;
  onResetSession: () => void;
}) {
  const providerLabel = getProviderLabel(provider);
  const requiresKey = mode === "live";
  const modelOptions = getProviderModelOptions(provider);

  return (
    <Panel className="h-full">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="brand">Run Benchmark</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              Local benchmark runner
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Choose the model, keep the key in the current session only, and run
              the V{BENCHMARK_VERSION.replace("V", "")} benchmark against the fixed
              nine-role task set.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/45 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Provider tested
            </p>
            <p className="mt-2 text-sm font-medium text-white">{providerLabel}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Provider
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["openai", "anthropic"] as const).map((value) => (
                <button
                  className={`rounded-2xl border px-4 py-3 text-sm transition ${
                    provider === value
                      ? "border-cyan-300/30 bg-cyan-300/12 text-white"
                      : "border-white/10 bg-white/6 text-slate-300 hover:border-white/20"
                  }`}
                  key={value}
                  onClick={() => onProviderChange(value)}
                  type="button"
                >
                  {getProviderLabel(value)}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Benchmark mode
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["mock", "live"] as const).map((value) => (
                <button
                  className={`rounded-2xl border px-4 py-3 text-sm transition ${
                    mode === value
                      ? "border-cyan-300/30 bg-cyan-300/12 text-white"
                      : "border-white/10 bg-white/6 text-slate-300 hover:border-white/20"
                  }`}
                  key={value}
                  onClick={() => onModeChange(value)}
                  type="button"
                >
                  {value === "mock" ? "Mock baseline" : `Live ${providerLabel}`}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Security
            </p>
            <div className="mt-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-100">
                <Shield className="h-4 w-4" />
              </div>
              <p className="text-sm leading-6 text-slate-300">{BENCHMARK_SECURITY_NOTE}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
            <label className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Exact model tested
            </label>
            <select
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/35"
              onChange={(event) => onModelPresetChange(event.target.value)}
              value={modelPreset}
            >
              {modelOptions.map((option) => (
                <option className="bg-slate-950" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option className="bg-slate-950" value="custom">
                Custom model name
              </option>
            </select>
            <label className="mt-4 block text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Manual model override
            </label>
            <input
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
              onChange={(event) => onCustomModelChange(event.target.value)}
              placeholder={`Enter exact ${providerLabel} model name`}
              value={customModel}
            />
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Use the dropdown for common {providerLabel} baselines or enter the exact
              model string you want to test in live mode.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
            <div className="flex items-center justify-between gap-3">
              <label className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                {providerLabel} API key
              </label>
              <Badge tone={requiresKey ? "warning" : "neutral"}>
                {requiresKey ? "Required in live mode" : "Optional in mock mode"}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4">
              <KeyRound className="h-4 w-4 text-slate-500" />
              <input
                className="h-14 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                onChange={(event) => onApiKeyChange(event.target.value)}
                placeholder={getApiKeyPlaceholder(provider)}
                type={showKey ? "text" : "password"}
                value={apiKey}
              />
              <button
                className="text-slate-400 transition hover:text-white"
                onClick={onToggleKeyVisibility}
                type="button"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                disabled={isRunning || (requiresKey && !apiKey.trim())}
                onClick={onRun}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isRunning ? "Running benchmark..." : "Start benchmark"}
              </Button>
              <Button
                disabled={!apiKey}
                onClick={onClearKey}
                variant="secondary"
              >
                Clear key
              </Button>
              <Button onClick={onResetSession} variant="ghost">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset session run
              </Button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              The key is never written to a database. In V1 it is passed only for the
              current local run and can be cleared immediately.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
