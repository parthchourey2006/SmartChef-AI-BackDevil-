"use client"

import { Check, X } from "lucide-react"

const comparisonData = [
  { feature: "Ingredient-first approach", smartchef: true, others: false },
  { feature: "Molecular substitutions", smartchef: true, others: false },
  { feature: "Waste reduction metrics", smartchef: true, others: false },
  { feature: "Fridge utilization scoring", smartchef: true, others: false },
  { feature: "Recipe search", smartchef: true, others: true },
  { feature: "Nutritional info", smartchef: true, others: true },
]

export function ComparisonSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Recipe Apps vs SmartChef AI
          </h2>
          <p className="text-muted-foreground text-lg">
            Not all recipe platforms are created equal.
          </p>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-4 md:p-6 border-b border-border/50">
            <div className="text-sm font-medium text-muted-foreground">Feature</div>
            <div className="text-sm font-semibold text-primary text-center">SmartChef AI</div>
            <div className="text-sm font-medium text-muted-foreground text-center">Others</div>
          </div>
          {comparisonData.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 gap-4 p-4 md:p-6 ${
                i < comparisonData.length - 1 ? "border-b border-border/30" : ""
              }`}
            >
              <div className="text-sm text-foreground">{row.feature}</div>
              <div className="flex justify-center">
                {row.smartchef ? (
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-destructive/15 flex items-center justify-center">
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {row.others ? (
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-destructive/15 flex items-center justify-center">
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
