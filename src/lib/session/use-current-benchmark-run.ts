"use client";

import { useState } from "react";

import { sampleBenchmarkRun } from "@/lib/benchmark/sample-run";
import type { BenchmarkRunResult, CurrentRunState } from "@/lib/benchmark/types";
import {
  clearStoredBenchmarkRun,
  loadStoredBenchmarkRun,
  storeBenchmarkRun,
} from "@/lib/session/benchmark-session";

export function useCurrentBenchmarkRun() {
  const [state, setState] = useState<CurrentRunState>(() => {
    const storedRun = loadStoredBenchmarkRun();

    if (storedRun) {
      return {
        run: storedRun,
        isSampleRun: false,
      };
    }

    return {
      run: sampleBenchmarkRun,
      isSampleRun: true,
    };
  });

  function setCurrentRun(run: BenchmarkRunResult) {
    storeBenchmarkRun(run);
    setState({
      run,
      isSampleRun: false,
    });
  }

  function resetToSampleRun() {
    clearStoredBenchmarkRun();
    setState({
      run: sampleBenchmarkRun,
      isSampleRun: true,
    });
  }

  return {
    run: state.run,
    isSampleRun: state.isSampleRun,
    setCurrentRun,
    resetToSampleRun,
  };
}
