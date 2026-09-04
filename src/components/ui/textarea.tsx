"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        data-slot="textarea"
        ref={ref}
        className={cn(
          "flex min-h-[90px] w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all outline-none focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#FF4D70] aria-invalid:ring-1 aria-invalid:ring-[#FF4D70]/40 font-sans resize-y",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
