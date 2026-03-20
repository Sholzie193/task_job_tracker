import { Badge } from "@/components/ui/badge";

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-3">
        <Badge tone="neutral">{eyebrow}</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl font-medium tracking-[-0.07em] text-[color:var(--text-1)] sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--text-2)]">
            {description}
          </p>
        </div>
      </div>
      {action}
    </section>
  );
}
