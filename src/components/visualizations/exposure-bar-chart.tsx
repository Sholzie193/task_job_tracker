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
        eyebrow="Distribution"
        title="Exposure distribution"
        description="Across 9 roles."
      />
      <Panel className="h-[420px] p-4">
        <ExposureBarChartClient run={run} />
      </Panel>
    </section>
  );
}
