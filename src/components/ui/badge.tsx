import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
  {
    variants: {
      tone: {
        brand: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
        neutral: "border-white/10 bg-white/6 text-white/70",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
        warning: "border-amber-400/20 bg-amber-400/10 text-amber-100",
        danger: "border-rose-400/20 bg-rose-400/10 text-rose-100",
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

