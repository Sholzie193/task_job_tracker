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
    <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl space-y-4">
        <Badge tone="brand">{eyebrow}</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            {description}
          </p>
        </div>
      </div>
      {action}
    </section>
  );
}
