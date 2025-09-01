import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background text-accent hover:text-accent/80",
  {
    variants: {
      variant: {
        default: "p-2",
        destructive: "p-2 text-red-400 hover:text-red-300",
        outline: "p-2 border border-accent/20 hover:border-accent/40",
        secondary: "p-2 text-muted hover:text-accent",
        ghost: "p-2 hover:text-accent",
        link: "p-2 underline-offset-4 hover:underline",
      },
      size: {
        default: "p-2",
        sm: "px-3 py-1.5",
        lg: "px-4 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
