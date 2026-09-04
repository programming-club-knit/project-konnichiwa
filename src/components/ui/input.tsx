"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-all outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#FF4D70] aria-invalid:ring-1 aria-invalid:ring-[#FF4D70]/40 font-sans [color-scheme:dark]",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
