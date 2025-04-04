import * as React from "react"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm" {...props} ref={ref} />
  ),
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={className} {...props} ref={ref} />
))
Chart.displayName = "Chart"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className="rounded-md border bg-secondary text-secondary-foreground shadow-sm" {...props} ref={ref} />
  ),
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="p-4" {...props} ref={ref} />,
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, Chart, ChartTooltip, ChartTooltipContent }

