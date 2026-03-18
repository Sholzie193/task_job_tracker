import { Badge } from "@/components/ui/badge";

export function SectionHeading({
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-3">
        <Badge tone="neutral">{eyebrow}</Badge>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
            {title}
          </h2>
          <p className="text-sm leading-6 text-slate-300">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

