import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[6px] border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em]",
  {
    variants: {
      tone: {
        brand: "border-transparent text-white [background:linear-gradient(145deg,var(--accent-strong),var(--accent))]",
        neutral: "border-[color:var(--border)] bg-[var(--surface-soft)] text-[color:var(--text-2)]",
        success:
          "border-[color:color-mix(in_srgb,#10b981_32%,transparent)] bg-[color:color-mix(in_srgb,#10b981_13%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_76%,#047857)]",
        warning:
          "border-[color:color-mix(in_srgb,#f59e0b_30%,transparent)] bg-[color:color-mix(in_srgb,#f59e0b_13%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_78%,#b45309)]",
        danger:
          "border-[color:color-mix(in_srgb,#f43f5e_30%,transparent)] bg-[color:color-mix(in_srgb,#f43f5e_13%,var(--surface-soft))] text-[color:color-mix(in_srgb,var(--text-1)_78%,#be123c)]",
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
