"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Heart, Trash2, ChefHat } from "lucide-react"

export interface WishlistRecipe {
  name: string
  match: number
  utilization: number
  image: string
  cuisine: string
}

interface WishlistDrawerProps {
  isOpen: boolean
  onClose: () => void
  recipes: WishlistRecipe[]
  onRemove: (name: string) => void
}

export function WishlistDrawer({ isOpen, onClose, recipes, onRemove }: WishlistDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={onClose}
            style={{ backgroundColor: "hsla(222, 47%, 4%, 0.6)" }}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md flex flex-col"
            style={{ backgroundColor: "hsl(222, 44%, 7%)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Saved recipes wishlist"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                >
                  <Heart className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">My Wishlist</h2>
                  <p className="text-xs text-muted-foreground">
                    {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close wishlist"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {recipes.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-3">
                  {recipes.map((recipe, i) => (
                    <motion.div
                      key={recipe.name}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 250,
                        delay: i * 0.06,
                      }}
                      layout
                    >
                      <WishlistCard recipe={recipe} onRemove={onRemove} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {recipes.length > 0 && (
              <motion.div
                className="p-6 border-t border-border/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <ChefHat className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">Average Match</p>
                    <p className="text-lg font-display font-bold text-primary">
                      {Math.round(recipes.reduce((a, r) => a + r.match, 0) / recipes.length)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function WishlistCard({
  recipe,
  onRemove,
}: {
  recipe: WishlistRecipe
  onRemove: (name: string) => void
}) {
  return (
    <motion.div
      className="group relative rounded-xl overflow-hidden"
      style={{
        background: "hsla(222, 44%, 10%, 0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid hsla(222, 30%, 20%, 0.5)",
      }}
      whileHover={{
        y: -3,
        borderColor: "hsla(152, 68%, 45%, 0.35)",
        boxShadow: "0 0 30px hsla(152, 68%, 45%, 0.1), 0 8px 32px hsla(0, 0%, 0%, 0.2)",
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Image with zoom on hover */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-secondary/60">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.12 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm truncate">{recipe.name}</h4>
          <p className="text-xs text-muted-foreground mb-1.5">{recipe.cuisine}</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {recipe.match}% Match
            </span>
            <span className="text-[10px] text-muted-foreground">
              Fridge: {recipe.utilization}%
            </span>
          </div>
        </div>

        {/* Remove button */}
        <motion.button
          onClick={() => onRemove(recipe.name)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          aria-label={`Remove ${recipe.name} from wishlist`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      {/* Floating animated illustration */}
      <motion.div
        className="relative w-24 h-24 mb-6"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "hsla(152, 68%, 45%, 0.08)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-secondary/60 flex items-center justify-center border border-border/40"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-7 w-7 text-muted-foreground" />
          </motion.div>
        </div>
        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            style={{
              top: "50%",
              left: "50%",
              marginTop: -4,
              marginLeft: -4,
            }}
            animate={{
              x: [
                Math.cos((i * 2 * Math.PI) / 3) * 40,
                Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * 40,
                Math.cos((i * 2 * Math.PI) / 3 + 2 * Math.PI) * 40,
              ],
              y: [
                Math.sin((i * 2 * Math.PI) / 3) * 40,
                Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * 40,
                Math.sin((i * 2 * Math.PI) / 3 + 2 * Math.PI) * 40,
              ],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      <motion.h3
        className="font-display text-lg font-semibold text-foreground mb-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        No recipes saved yet
      </motion.h3>
      <motion.p
        className="text-sm text-muted-foreground text-center max-w-[240px] leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        Swipe right to build your list.
      </motion.p>
    </div>
  )
}
