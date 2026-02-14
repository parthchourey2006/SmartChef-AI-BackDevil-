"use client"

import Image from "next/image"
import { ChefHat, ArrowRight } from "lucide-react"

interface Recipe {
  name: string
  match: number
  utilization: number
  image: string
  cuisine: string
}

const recipes: Recipe[] = [
  { name: "Garlic Herb Chicken", match: 92, utilization: 88, image: "/images/garlic-herb-chicken.jpg", cuisine: "Mediterranean" },
  { name: "Tomato Basil Pasta", match: 85, utilization: 76, image: "/images/tomato-basil-pasta.jpg", cuisine: "Italian" },
  { name: "Stir Fry Rice Bowl", match: 78, utilization: 70, image: "/images/stir-fry-rice.jpg", cuisine: "Asian Fusion" },
  { name: "Veggie Omelette", match: 74, utilization: 65, image: "/images/veggie-omelette.jpg", cuisine: "French" },
]

interface RecipeCardsProps {
  onViewSubstitutions: (recipe: string) => void
}

export function RecipeCards({ onViewSubstitutions }: RecipeCardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ChefHat className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Ranked Recipes</h3>
      </div>

      <div className="space-y-3">
        {recipes.map((recipe, i) => (
          <div
            key={recipe.name}
            className="glass-card glass-card-hover rounded-xl p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              {/* Recipe image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-secondary/60">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground text-sm truncate">{recipe.name}</h4>
                  <span className="flex-shrink-0 inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                    {recipe.match}% Match
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{recipe.cuisine}</p>

                {/* Utilization bar */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Ingredient Utilization</span>
                    <span className="text-xs text-primary font-medium">{recipe.utilization}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${recipe.utilization}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onViewSubstitutions(recipe.name)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline transition-all group"
                >
                  View Substitutions
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
