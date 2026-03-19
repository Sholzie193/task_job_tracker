import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "neo-inset h-2.5 overflow-hidden rounded-full",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 [background:linear-gradient(145deg,var(--accent-strong),var(--accent))]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
