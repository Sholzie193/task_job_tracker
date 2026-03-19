"use client";

import { useEffect, useState } from "react";

import { SESSION_RUN_EVENT } from "@/lib/benchmark/constants";
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

  useEffect(() => {
    function syncRunState(event: Event) {
      const customEvent = event as CustomEvent<BenchmarkRunResult | null>;

      if (customEvent.detail) {
        setState({
          run: customEvent.detail,
          isSampleRun: false,
        });
        return;
      }

      setState({
        run: sampleBenchmarkRun,
        isSampleRun: true,
      });
    }

    window.addEventListener(SESSION_RUN_EVENT, syncRunState as EventListener);

    return () => {
      window.removeEventListener(SESSION_RUN_EVENT, syncRunState as EventListener);
    };
  }, []);

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
