"use client"

import { useState, useCallback } from "react"
import { Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { IngredientInput } from "@/components/dashboard/ingredient-input"
import { RecipeCards } from "@/components/dashboard/recipe-cards"
import { SubstitutionPanel, SubstitutionSciencePanel } from "@/components/dashboard/substitution-panel"
import { FridgeUtilization } from "@/components/dashboard/fridge-utilization"
import { WasteMetrics } from "@/components/dashboard/waste-metrics"
import { LoadingState } from "@/components/dashboard/loading-state"

type ViewState = "idle" | "loading" | "results"

export default function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>("idle")
  const [showScience, setShowScience] = useState(false)

  const handleGenerate = useCallback((ingredients: string[]) => {
    if (ingredients.length === 0) return
    setViewState("loading")
    setShowScience(false)
    // Simulate analysis
    setTimeout(() => {
      setViewState("results")
    }, 2500)
  }, [])

  const handleViewSubstitutions = useCallback(() => {
    setShowScience(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Leaf className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-foreground">SmartChef AI</span>
                <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">Cook What You Have. Waste Nothing.</p>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center rounded-md border border-border/40 bg-secondary/30 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            Powered by RecipeDB + FlavorDB
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-10">
          <IngredientInput onGenerate={handleGenerate} isLoading={viewState === "loading"} />
        </div>

        {/* Loading State */}
        {viewState === "loading" && <LoadingState />}

        {/* Results */}
        {viewState === "results" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Three column results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecipeCards onViewSubstitutions={handleViewSubstitutions} />
              <SubstitutionPanel />
              <FridgeUtilization />
            </div>

            {/* Science panel */}
            {showScience && (
              <div className="animate-fade-in-up">
                <SubstitutionSciencePanel />
              </div>
            )}

            {/* Waste Metrics */}
            <WasteMetrics />
          </div>
        )}

        {/* Idle state hint */}
        {viewState === "idle" && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-float">
              <Leaf className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Start by adding your ingredients
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Add what you have in your fridge, and we will find the best recipes, smart substitutions, and track your waste reduction impact.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
