"use client"

import { useEffect, useState } from "react"
import { Refrigerator } from "lucide-react"

export function FridgeUtilization() {
  const [score] = useState(74)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1200
    const steps = 60
    const increment = score / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [score])

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Refrigerator className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Fridge Utilization</h3>
      </div>

      <div className="glass-card rounded-xl p-6 flex flex-col items-center">
        {/* Circular progress */}
        <div className="relative w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="hsl(222 30% 16%)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="hsl(152 68% 45%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                filter: "drop-shadow(0 0 6px hsl(152 68% 45% / 0.4))",
                transition: "stroke-dashoffset 1.2s ease-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-foreground">{animatedScore}%</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
          </div>
        </div>

        <p className="text-sm font-medium text-foreground mb-1">Fridge Utilization Score</p>
        <p className="text-xs text-muted-foreground text-center">
          Higher score = less waste.
        </p>

        {/* Breakdown */}
        <div className="w-full mt-5 space-y-2.5">
          <BreakdownItem label="Matched Ingredients" value="8/11" percentage={73} />
          <BreakdownItem label="Expiring Soon" value="3 items" percentage={27} color="warning" />
          <BreakdownItem label="Fully Used" value="5 items" percentage={45} />
        </div>
      </div>
    </div>
  )
}

function BreakdownItem({
  label,
  value,
  percentage,
  color = "primary",
}: {
  label: string
  value: string
  percentage: number
  color?: "primary" | "warning"
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground">{value}</span>
      </div>
      <div className="w-full h-1 rounded-full bg-secondary/60 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            color === "warning" ? "bg-amber-500" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
