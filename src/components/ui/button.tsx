import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80",
  {
    variants: {
      variant: {
        primary:
          "border-cyan-300/30 bg-linear-to-r from-cyan-300 via-sky-300 to-blue-400 px-5 py-3 text-slate-950 shadow-[0_16px_50px_-18px_rgba(34,211,238,0.85)] hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "border-white/10 bg-white/6 px-5 py-3 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/20 hover:bg-white/10",
        ghost:
          "border-transparent bg-transparent px-4 py-3 text-white/65 hover:bg-white/6 hover:text-white",
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

