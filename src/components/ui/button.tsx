import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl border text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/60",
  {
    variants: {
      variant: {
        primary:
          "border-transparent px-5 py-3 text-white shadow-[0_16px_34px_-18px_color-mix(in_srgb,var(--accent)_56%,transparent)] [background:linear-gradient(145deg,var(--accent-strong),var(--accent))] hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "border-[color:var(--border)] bg-[var(--surface-2)] px-5 py-3 text-[color:var(--text-1)] shadow-[var(--shadow-pill)] hover:-translate-y-0.5",
        ghost:
          "border-transparent bg-transparent px-4 py-3 text-[color:var(--text-2)] hover:bg-[var(--surface-soft)] hover:text-[color:var(--text-1)]",
        danger:
          "border-rose-400/20 bg-rose-500/10 px-5 py-3 text-rose-100 hover:bg-rose-500/18",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
