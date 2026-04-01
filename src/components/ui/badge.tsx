import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80",
        secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        outline: "text-zinc-950 border-zinc-200 bg-white",
        accent: "border-transparent bg-red-50 text-red-900 border border-red-200/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
