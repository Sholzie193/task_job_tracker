import { AppShell } from "@/components/app-shell/app-shell";
import { BackNavButton } from "@/components/app-shell/back-nav-button";
import { PageIntro } from "@/components/app-shell/page-intro";
import { MethodologyCard } from "@/components/dashboard/methodology-card";
import { Panel } from "@/components/ui/panel";

const interpretationPoints = [
  "High exposure means the tested model handled a larger share of the sampled tasks well, not that the full role vanishes.",
  "Autonomy confidence is intentionally stricter than automation confidence because supervised help and independent delegation are not the same.",
  "Physical and embodied roles score lower because language models cannot inspect, manipulate, or safely execute in the physical world.",
  "This V1 benchmark is a capability lens for selected role tasks. It is not a macro labor forecast.",
];

export function MethodologyPage() {
  return (
    <AppShell>
      <BackNavButton fallbackHref="/overview" label="Back to overview" />
      <PageIntro
        description="Interpretation lives here instead of on the overview page so the main dashboard can stay calm and high-signal."
        eyebrow="Methodology"
        title="Understand what the benchmark means before over-reading the score."
      />

      <MethodologyCard />

      <section className="grid gap-4 lg:grid-cols-2">
        {interpretationPoints.map((point) => (
          <Panel className="p-5" key={point}>
            <p className="text-sm leading-7 text-slate-300">{point}</p>
          </Panel>
        ))}
      </section>
    </AppShell>
  );
}
