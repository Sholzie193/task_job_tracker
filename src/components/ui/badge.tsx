import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
  {
    variants: {
      tone: {
        brand: "border-transparent text-white [background:linear-gradient(145deg,var(--accent-strong),var(--accent))]",
        neutral: "border-[color:var(--border)] bg-[var(--surface-soft)] text-[color:var(--text-2)]",
        success: "border-emerald-400/22 bg-emerald-500/12 text-emerald-200",
        warning: "border-amber-400/22 bg-amber-500/12 text-amber-200",
        danger: "border-rose-400/22 bg-rose-500/12 text-rose-200",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ className, tone, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}
