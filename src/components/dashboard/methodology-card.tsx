import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

const points = [
  "This is a task-based benchmark, not a direct job-loss predictor.",
  "Scores reflect current tested model performance on selected tasks in this V1 benchmark.",
  "Exposure does not equal guaranteed replacement; workflow design, QA, and accountability still matter.",
  "Physical and manual roles usually score lower because LLMs remain weak in embodied action.",
  "Use the result as a capability and exposure signal, not a labor-market certainty claim.",
];

export function MethodologyCard() {
  return (
    <section className="space-y-5" id="methodology">
      <SectionHeading
        eyebrow="Methodology"
        title="Interpret the score as exposure, not destiny"
        description="The benchmark is meant to surface where current frontier models can already absorb realistic task slices, and where human judgment or physical execution still anchors the role."
      />
      <Panel>
        <div className="grid gap-3">
          {points.map((point) => (
            <div
              className="neo-inset rounded-2xl px-4 py-3 text-sm leading-6 text-[color:var(--text-2)]"
              key={point}
            >
              {point}
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
