import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, CheckCircle, Circle } from "lucide-react"

export interface SidebarStep {
  id: string
  title: string
  description?: string
  completed?: boolean
  active?: boolean
}

interface SidebarProps {
  steps: SidebarStep[]
  onStepClick?: (stepId: string) => void
  className?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ steps, onStepClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-80 bg-gray-800 border-r border-gray-700 p-6 space-y-4",
          className
        )}
        {...props}
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-100">Quote Builder</h2>
          <p className="text-sm text-gray-400">Step-by-step process</p>
        </div>
        
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                {
                  "bg-blue-600/20 border border-blue-500/30": step.active,
                  "hover:bg-gray-700/50": !step.active,
                }
              )}
              onClick={() => onStepClick?.(step.id)}
            >
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : step.active ? (
                  <Circle className="w-5 h-5 text-blue-500 fill-current" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium",
                  {
                    "text-blue-400": step.active,
                    "text-green-400": step.completed,
                    "text-gray-300": !step.active && !step.completed,
                  }
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
              
              {step.active && (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export { Sidebar }

