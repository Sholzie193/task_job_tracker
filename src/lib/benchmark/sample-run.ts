import {
  DEFAULT_MODEL,
  DEFAULT_SAMPLE_RUN_DATE,
  DEFAULT_PROVIDER,
} from "@/lib/benchmark/constants";
import { generateMockBenchmarkRun } from "@/lib/benchmark/mock-engine";

export const sampleBenchmarkRun = generateMockBenchmarkRun({
  provider: DEFAULT_PROVIDER,
  model: DEFAULT_MODEL,
  runDate: DEFAULT_SAMPLE_RUN_DATE,
});

