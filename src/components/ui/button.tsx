import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-display font-bold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: Dark Charcoal bg, white text, cyan glow border
        default: "bg-dark-charcoal text-foreground border border-primary/20 hover:bg-dark-purple hover:border-primary/40 hover:shadow-glow-primary active:scale-[0.98]",
        // Destructive: Dark red
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        // Secondary/Outline: Transparent with cyan border
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:scale-[0.98]",
        secondary: "bg-dark-gray text-foreground border border-border hover:bg-dark-charcoal hover:border-primary/30 active:scale-[0.98]",
        // Ghost: Minimal
        ghost: "text-muted-foreground hover:text-foreground hover:bg-dark-charcoal/50",
        // Link
        link: "text-primary underline-offset-4 hover:underline",
        // Game button: Special styling for main CTAs
        game: "bg-dark-charcoal text-foreground border border-primary/20 font-display uppercase tracking-wider hover:bg-dark-purple hover:border-primary/40 hover:shadow-glow-primary active:scale-[0.98]",
        // Cyan accent button
        cyan: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-cyan active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };