"use client"
import { fetchRecipes } from "@/lib/recipe"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Leaf, ArrowLeft, Heart, LayoutGrid, Layers } from "lucide-react"
import Link from "next/link"
import { IngredientInput } from "@/components/dashboard/ingredient-input"
import { RecipeCards } from "@/components/dashboard/recipe-cards"
import { SubstitutionPanel, SubstitutionSciencePanel } from "@/components/dashboard/substitution-panel"
import { FridgeUtilization } from "@/components/dashboard/fridge-utilization"
import { WasteMetrics } from "@/components/dashboard/waste-metrics"
import { LoadingState } from "@/components/dashboard/loading-state"
import { WishlistDrawer, type WishlistRecipe } from "@/components/dashboard/wishlist-drawer"
import { SwipeDeck } from "@/components/dashboard/swipe-deck"

type ViewState = "idle" | "loading" | "results"
type ResultsView = "grid" | "swipe"

export default function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>("idle")
  const [showScience, setShowScience] = useState(false)
  const [resultsView, setResultsView] = useState<ResultsView>("swipe")
  const [recipes, setRecipes] = useState([])

  // Wishlist state
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [wishlistRecipes, setWishlistRecipes] = useState<WishlistRecipe[]>([])

  const handleGenerate = useCallback(async () => {
    const data = await fetchRecipes(selectedIngredients)
    setRecipes(data)
    setViewState("results")
  }, [selectedIngredients])


  setRecipes(data)
  setViewState("results")
}, [])

const handleViewSubstitutions = useCallback(() => {
  setShowScience(true)
}, [])

const handleSaveRecipe = useCallback((recipe: WishlistRecipe) => {
  setWishlistRecipes((prev) => {
    if (prev.find((r) => r.name === recipe.name)) return prev
    return [...prev, recipe]
  })
}, [])

const handleRemoveRecipe = useCallback((name: string) => {
  setWishlistRecipes((prev) => prev.filter((r) => r.name !== name))
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

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center rounded-md border border-border/40 bg-secondary/30 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            Powered by RecipeDB + FlavorDB
          </span>

          {/* Wishlist button */}
          <motion.button
            onClick={() => setWishlistOpen(true)}
            className="relative w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistRecipes.length > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {wishlistRecipes.length}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Input Section */}
      <div className="max-w-3xl mx-auto mb-10">
        <IngredientInput onGenerate={handleGenerate} isLoading={viewState === "loading"} />
      </div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {viewState === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <LoadingState />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {viewState === "results" && (
          <motion.div
            key="results"
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* View toggle */}
            <div className="flex items-center justify-center gap-2">
              <div
                className="inline-flex items-center rounded-xl p-1"
                style={{ background: "hsla(222, 30%, 14%, 0.6)" }}
              >
                <button
                  onClick={() => setResultsView("swipe")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${resultsView === "swipe"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Layers className="h-4 w-4" />
                  Swipe Deck
                </button>
                <button
                  onClick={() => setResultsView("grid")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${resultsView === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Grid View
                </button>
              </div>
            </div>

            {/* Swipe view */}
            {resultsView === "swipe" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SwipeDeck onSaveRecipe={handleSaveRecipe} />
              </motion.div>
            )}

            {/* Grid view */}
            {resultsView === "grid" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Three column results */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <RecipeCards onViewSubstitutions={handleViewSubstitutions} />
                  <SubstitutionPanel />
                  <FridgeUtilization />
                </div>

                {/* Science panel */}
                <AnimatePresence>
                  {showScience && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 20, height: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="mt-8"
                    >
                      <SubstitutionSciencePanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Waste Metrics - always visible in results */}
            <WasteMetrics />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state hint */}
      {viewState === "idle" && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="h-7 w-7 text-primary" />
          </motion.div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Start by adding your ingredients
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Add what you have in your fridge, and we will find the best recipes, smart substitutions, and track your waste reduction impact.
          </p>
        </motion.div>
      )}
    </main>

    {/* Wishlist Drawer */}
    <WishlistDrawer
      isOpen={wishlistOpen}
      onClose={() => setWishlistOpen(false)}
      recipes={wishlistRecipes}
      onRemove={handleRemoveRecipe}
    />
  </div>
)
}
