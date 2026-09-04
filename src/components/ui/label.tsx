"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.ComponentProps<"label"> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn(
          "text-xs font-bold text-[#8C93B0] uppercase tracking-wider select-none leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-sans",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
