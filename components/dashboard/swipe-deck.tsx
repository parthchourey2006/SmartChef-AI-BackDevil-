"use client"

import { useState, useCallback } from "react"
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  type PanInfo,
} from "framer-motion"
import Image from "next/image"
import { Heart, X } from "lucide-react"
import { SwipeCardSubstitution } from "./expandable-substitution"
import type { WishlistRecipe } from "./wishlist-drawer"

interface SwipeDeckRecipe {
  name: string
  match: number
  utilization: number
  image: string
  cuisine: string
}

const SWIPE_THRESHOLD = 120
const ROTATION_FACTOR = 0.1

const allRecipes: SwipeDeckRecipe[] = [
  { name: "Garlic Herb Chicken", match: 92, utilization: 88, image: "/images/garlic-herb-chicken.jpg", cuisine: "Mediterranean" },
  { name: "Tomato Basil Pasta", match: 85, utilization: 76, image: "/images/tomato-basil-pasta.jpg", cuisine: "Italian" },
  { name: "Stir Fry Rice Bowl", match: 78, utilization: 70, image: "/images/stir-fry-rice.jpg", cuisine: "Asian Fusion" },
  { name: "Veggie Omelette", match: 74, utilization: 65, image: "/images/veggie-omelette.jpg", cuisine: "French" },
]

interface SwipeDeckProps {
  onSaveRecipe: (recipe: WishlistRecipe) => void
}

export function SwipeDeck({ onSaveRecipe }: SwipeDeckProps) {
  const [deck, setDeck] = useState(allRecipes)
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null)
  const [feedback, setFeedback] = useState<"like" | "nope" | null>(null)

  const currentCard = deck[0]
  const nextCards = deck.slice(1, 3)

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentCard) return
      setExitDirection(direction)
      setFeedback(direction === "right" ? "like" : "nope")

      if (direction === "right") {
        onSaveRecipe(currentCard)
      }

      setTimeout(() => {
        setDeck((prev) => prev.slice(1))
        setExitDirection(null)
        setFeedback(null)
      }, 350)
    },
    [currentCard, onSaveRecipe]
  )

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x > SWIPE_THRESHOLD) {
        handleSwipe("right")
      } else if (info.offset.x < -SWIPE_THRESHOLD) {
        handleSwipe("left")
      }
    },
    [handleSwipe]
  )

  if (deck.length === 0) {
    return <DeckEmpty />
  }

  return (
    <div className="flex flex-col items-center">
      {/* Card stack */}
      <div className="relative w-full max-w-sm h-[480px] mb-8">
        {/* Stacked preview cards behind */}
        {nextCards.map((recipe, i) => (
          <motion.div
            key={`stack-${recipe.name}`}
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
            style={{
              background: "hsla(222, 44%, 10%, 0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid hsla(222, 30%, 20%, 0.4)",
              zIndex: 10 - i,
            }}
            animate={{
              y: 12 * (i + 1),
              scale: 1 - 0.04 * (i + 1),
              opacity: 1 - 0.25 * (i + 1),
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          />
        ))}

        {/* Active card */}
        <AnimatePresence mode="popLayout">
          {currentCard && (
            <SwipeCard
              key={currentCard.name}
              recipe={currentCard}
              onDragEnd={handleDragEnd}
              exitDirection={exitDirection}
            />
          )}
        </AnimatePresence>

        {/* Micro feedback overlays */}
        <AnimatePresence>
          {feedback === "like" && (
            <motion.div
              className="absolute top-6 right-6 z-50"
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "hsla(152, 68%, 45%, 0.2)", border: "2px solid hsl(152 68% 45%)" }}>
                <Heart className="h-8 w-8 text-primary" fill="hsl(152 68% 45%)" />
              </div>
            </motion.div>
          )}
          {feedback === "nope" && (
            <motion.div
              className="absolute top-6 left-6 z-50"
              initial={{ opacity: 0, scale: 0, rotate: 30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "hsla(0, 72%, 51%, 0.2)", border: "2px solid hsl(0 72% 51%)" }}>
                <X className="h-8 w-8 text-destructive" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-8">
        <motion.button
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 rounded-full flex items-center justify-center border-2"
          style={{
            borderColor: "hsl(0 72% 51% / 0.5)",
            background: "hsla(0, 72%, 51%, 0.08)",
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 24px hsla(0, 72%, 51%, 0.25)",
          }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          aria-label="Skip recipe"
        >
          <X className="h-6 w-6 text-destructive" />
        </motion.button>

        <motion.button
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full flex items-center justify-center border-2"
          style={{
            borderColor: "hsl(152 68% 45% / 0.5)",
            background: "hsla(152, 68%, 45%, 0.08)",
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 24px hsla(152, 68%, 45%, 0.25)",
          }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          aria-label="Save recipe"
        >
          <Heart className="h-6 w-6 text-primary" />
        </motion.button>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Drag to swipe or use buttons
      </p>
    </div>
  )
}

function SwipeCard({
  recipe,
  onDragEnd,
  exitDirection,
}: {
  recipe: SwipeDeckRecipe
  onDragEnd: (_: unknown, info: PanInfo) => void
  exitDirection: "left" | "right" | null
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-15 * ROTATION_FACTOR * 10, 0, 15 * ROTATION_FACTOR * 10])
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0.6, 0.9, 1, 0.9, 0.6])

  // Background color shift based on drag direction
  const bgRed = useTransform(x, [-200, 0], [0.15, 0])
  const bgGreen = useTransform(x, [0, 200], [0, 0.15])

  return (
    <motion.div
      className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing touch-none"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: exitDirection === "right" ? 600 : exitDirection === "left" ? -600 : 0,
        rotate: exitDirection === "right" ? 20 : exitDirection === "left" ? -20 : 0,
        opacity: 0,
        transition: {
          duration: 0.35,
          ease: [0.32, 0.72, 0, 1],
        },
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 250,
      }}
    >
      {/* Red / Green tint overlays */}
      <motion.div
        className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
        style={{
          background: "hsla(0, 72%, 51%, 0.15)",
          opacity: bgRed,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
        style={{
          background: "hsla(152, 68%, 45%, 0.15)",
          opacity: bgGreen,
        }}
      />

      {/* Card body */}
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "hsla(222, 44%, 9%, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid hsla(222, 30%, 20%, 0.5)",
          boxShadow: "0 20px 60px hsla(0, 0%, 0%, 0.3), 0 0 40px hsla(152, 68%, 45%, 0.05)",
        }}
      >
        {/* Recipe image */}
        <div className="relative h-52 bg-secondary/40 flex-shrink-0">
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 384px) 100vw, 384px"
            draggable={false}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 50%, hsla(222, 44%, 9%, 0.95))",
            }}
          />
          {/* Match badge */}
          <motion.div
            className="absolute bottom-4 left-4 inline-flex items-center rounded-xl px-3 py-1.5"
            style={{
              background: "hsla(152, 68%, 45%, 0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid hsla(152, 68%, 45%, 0.3)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm font-bold text-primary">{recipe.match}% Match</span>
          </motion.div>
        </div>

        {/* Card content */}
        <div className="flex-1 p-5 flex flex-col">
          <motion.h3
            className="font-display text-xl font-bold text-foreground mb-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {recipe.name}
          </motion.h3>

          <motion.p
            className="text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {recipe.cuisine}
          </motion.p>

          {/* Fridge utilization line */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Fridge Utilization</span>
              <span className="text-xs font-semibold text-primary">{recipe.utilization}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary/50 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${recipe.utilization}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                style={{
                  boxShadow: "0 0 8px hsl(152 68% 45% / 0.4)",
                }}
              />
            </div>
          </motion.div>

          {/* Expandable substitution */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-auto"
          >
            <SwipeCardSubstitution />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function DeckEmpty() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <motion.div
        className="w-20 h-20 rounded-2xl bg-secondary/40 flex items-center justify-center mb-6 border border-border/30"
        animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="h-8 w-8 text-muted-foreground" />
      </motion.div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        {"You've seen all recipes!"}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Add more ingredients or check your wishlist to start cooking.
      </p>
    </motion.div>
  )
}
