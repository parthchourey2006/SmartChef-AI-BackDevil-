"use client"

import { Loader2 } from "lucide-react"

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full glow-pulse" />

        {/* Spinning circle */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full animate-spin-slow" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="hsl(222 30% 16%)"
              strokeWidth="4"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="hsl(152 68% 45%)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="180 220"
              style={{ filter: "drop-shadow(0 0 8px hsl(152 68% 45% / 0.5))" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        </div>
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground mb-2 animate-pulse">
        Analyzing Your Ingredients...
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Scanning RecipeDB and FlavorDB for optimal matches.
      </p>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  )
}
