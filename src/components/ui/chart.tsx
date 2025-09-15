import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, any>
  }
>(({ className, config, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full h-full", className)}
      {...props}
    />
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ children, ...props }: any) => {
  return children
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    formatter?: (value: any, name: string) => [string, string]
  }
>(({ className, formatter, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
      {...props}
    />
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }