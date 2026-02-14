"use client"

import { useState, useRef } from "react"
import { X, Plus, Sparkles } from "lucide-react"

interface IngredientInputProps {
  onGenerate: (ingredients: string[]) => void
  isLoading: boolean
}

const suggestions = [
  "Chicken", "Tomatoes", "Onion", "Garlic", "Rice", "Pasta", "Eggs",
  "Cheese", "Bell Pepper", "Broccoli", "Lemon", "Olive Oil",
]

export function IngredientInput({ onGenerate, isLoading }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim()
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed])
      setInputValue("")
      inputRef.current?.focus()
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addIngredient(inputValue)
    }
    if (e.key === "Backspace" && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients[ingredients.length - 1])
    }
  }

  return (
    <div className="glass-card glow-green rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {"What's in Your Fridge?"}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Ingredient-first, not recipe-first.
      </p>

      {/* Tag input area */}
      <div
        className="min-h-[60px] rounded-xl border border-border/50 bg-secondary/30 p-3 flex flex-wrap gap-2 cursor-text transition-colors focus-within:border-primary/50"
        onClick={() => inputRef.current?.focus()}
        role="group"
        aria-label="Ingredient list"
      >
        {ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 text-primary px-3 py-1.5 text-sm font-medium transition-all hover:bg-primary/25"
          >
            {ingredient}
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeIngredient(ingredient)
              }}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${ingredient}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ingredients.length === 0 ? "Type an ingredient and press Enter..." : "Add more..."}
          className="flex-1 min-w-[150px] bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none py-1.5"
          aria-label="Add ingredient"
        />
      </div>

      {/* Quick add suggestions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions
          .filter((s) => !ingredients.includes(s))
          .slice(0, 8)
          .map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => addIngredient(suggestion)}
              className="inline-flex items-center gap-1 rounded-lg border border-border/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <Plus className="h-3 w-3" />
              {suggestion}
            </button>
          ))}
      </div>

      {/* Generate button */}
      <button
        onClick={() => onGenerate(ingredients)}
        disabled={ingredients.length === 0 || isLoading}
        className="mt-6 w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-green"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading ? "Analyzing..." : "Generate Smart Matches"}
      </button>
    </div>
  )
}
