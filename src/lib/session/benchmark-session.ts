"use client";

import { SESSION_RUN_EVENT, SESSION_RUN_STORAGE_KEY } from "@/lib/benchmark/constants";
import { buildRunId } from "@/lib/benchmark/scoring";
import type { BenchmarkRunResult } from "@/lib/benchmark/types";

function normalizeRun(run: BenchmarkRunResult) {
  if (run.meta.runId) {
    return run;
  }

  return {
    ...run,
    meta: {
      ...run.meta,
      runId: buildRunId(run.meta.model, run.meta.runDate),
    },
  };
}

export function loadStoredBenchmarkRun() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(SESSION_RUN_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return normalizeRun(JSON.parse(rawValue) as BenchmarkRunResult);
  } catch {
    window.sessionStorage.removeItem(SESSION_RUN_STORAGE_KEY);
    return null;
  }
}

export function storeBenchmarkRun(run: BenchmarkRunResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SESSION_RUN_STORAGE_KEY, JSON.stringify(run));
  window.dispatchEvent(new CustomEvent(SESSION_RUN_EVENT, { detail: normalizeRun(run) }));
}

export function clearStoredBenchmarkRun() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SESSION_RUN_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(SESSION_RUN_EVENT, { detail: null }));
}
