import dynamic from "next/dynamic";

import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import type { BenchmarkRunResult } from "@/lib/benchmark/types";

const ExposureBarChartClient = dynamic(
  () =>
    import("@/components/visualizations/exposure-bar-chart-client").then(
      (module) => module.ExposureBarChartClient,
    ),
  {
    ssr: false,
  },
);

export function ExposureBarChart({ run }: { run: BenchmarkRunResult }) {
  return (
    <section className="space-y-5">
      <SectionHeading
        eyebrow="Benchmark Overview"
        title="Role exposure distribution"
        description="A quick comparative view of the model’s exposure profile across all nine roles in the V1 benchmark."
      />
      <Panel className="h-[420px]">
        <ExposureBarChartClient run={run} />
      </Panel>
    </section>
  );
}

