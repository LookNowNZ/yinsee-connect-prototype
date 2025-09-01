import type React from "react"
import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "pill" | "pill-small" | "destructive"
}

const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "pill":
          return cn(
            "bg-[#1A1A22] border-2 border-[#6E6EE6] text-[#CFCFF7] font-semibold px-[18px] py-3 min-h-[44px] rounded-[10px] transition-all duration-160 ease-out",
            "hover:bg-[#242432] hover:border-[#8A8AF0] hover:shadow-[0_6px_14px_rgba(122,122,230,0.18)] hover:cursor-pointer",
            "active:bg-[#2B2B3A] active:border-[#B0B0FF] active:shadow-[0_2px_6px_rgba(122,122,230,0.22)]",
            "disabled:bg-[#15151B] disabled:border-[#3A3A48] disabled:text-[#7D7D9C] disabled:cursor-not-allowed disabled:hover:bg-[#15151B] disabled:hover:border-[#3A3A48] disabled:hover:shadow-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B0B0FF] focus-visible:outline-offset-[4px]",
          )
        case "pill-small":
          return cn(
            "bg-[#1A1A22] border-2 border-[#6E6EE6] text-[#CFCFF7] font-semibold px-4 py-2 min-h-[36px] rounded-[10px] transition-all duration-160 ease-out text-sm",
            "hover:bg-[#242432] hover:border-[#8A8AF0] hover:shadow-[0_6px_14px_rgba(122,122,230,0.18)] hover:cursor-pointer",
            "active:bg-[#2B2B3A] active:border-[#B0B0FF] active:shadow-[0_2px_6px_rgba(122,122,230,0.22)]",
            "disabled:bg-[#15151B] disabled:border-[#3A3A48] disabled:text-[#7D7D9C] disabled:cursor-not-allowed disabled:hover:bg-[#15151B] disabled:hover:border-[#3A3A48] disabled:hover:shadow-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B0B0FF] focus-visible:outline-offset-[4px]",
          )
        case "destructive":
          return cn(
            "text-red-400 font-semibold px-4 py-2 min-h-10 rounded transition-all duration-160 ease-out",
            "hover:text-red-300 hover:underline",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-red-400 disabled:hover:no-underline",
            "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-background",
          )
        default:
          return cn(
            "bg-[#1A1A22] border-2 border-[#6E6EE6] text-[#CFCFF7] font-semibold px-[18px] py-3 min-h-[44px] rounded-[10px] transition-all duration-160 ease-out",
            "hover:bg-[#242432] hover:border-[#8A8AF0] hover:shadow-[0_6px_14px_rgba(122,122,230,0.18)] hover:cursor-pointer",
            "active:bg-[#2B2B3A] active:border-[#B0B0FF] active:shadow-[0_2px_6px_rgba(122,122,230,0.22)]",
            "disabled:bg-[#15151B] disabled:border-[#3A3A48] disabled:text-[#7D7D9C] disabled:cursor-not-allowed disabled:hover:bg-[#15151B] disabled:hover:border-[#3A3A48] disabled:hover:shadow-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B0B0FF] focus-visible:outline-offset-[4px]",
          )
      }
    }

    return (
      <button
        className={cn("inline-flex items-center justify-center", getVariantStyles(), className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
TextButton.displayName = "TextButton"

export { TextButton }
