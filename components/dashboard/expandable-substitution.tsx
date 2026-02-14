"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react"

interface SubstitutionData {
  missing: string
  substitute: string
  compatibility: number
  compounds: string[]
  reason: string
}

interface ExpandableSubstitutionProps {
  data: SubstitutionData
}

function AnimatedScore({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setCurrent(0)
      return
    }

    const duration = 1400
    const steps = 70
    const increment = target / steps
    let value = 0

    const interval = setInterval(() => {
      value += increment
      if (value >= target) {
        setCurrent(target)
        clearInterval(interval)
      } else {
        setCurrent(Math.round(value))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [target, isVisible])

  return <span>{current}</span>
}

export function ExpandableSubstitution({ data }: ExpandableSubstitutionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggle = useCallback(() => setIsExpanded((v) => !v), [])

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: "hsla(222, 44%, 10%, 0.6)",
        backdropFilter: "blur(16px)",
        border: "1px solid hsla(222, 30%, 20%, 0.5)",
      }}
      layout
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      {/* Collapsed trigger */}
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-secondary/20"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <span className="text-sm text-foreground">
            <span className="font-medium">1 Ingredient Missing</span>
            <span className="text-muted-foreground"> -- View Smart Substitution</span>
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: "spring", damping: 28, stiffness: 220 },
              opacity: { duration: 0.25, delay: 0.05 },
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Divider */}
              <motion.div
                className="h-px bg-border/40 mb-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ transformOrigin: "left" }}
              />

              {/* Missing to Substitute row */}
              <motion.div
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <div className="flex-1 glass-card rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertCircle className="h-3 w-3 text-destructive" />
                    <span className="text-[10px] font-medium text-destructive uppercase tracking-wider">Missing</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{data.missing}</p>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                >
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="text-primary">
                    <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>

                <div className="flex-1 glass-card rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-medium text-primary uppercase tracking-wider">FlavorDB</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{data.substitute}</p>
                </div>
              </motion.div>

              {/* Compatibility score with counting animation and glow */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              >
                <span className="text-xs text-muted-foreground">Flavor Compatibility:</span>
                <motion.div
                  className="relative inline-flex items-center justify-center px-3 py-1.5 rounded-lg"
                  style={{ background: "hsla(152, 68%, 45%, 0.1)" }}
                  animate={{
                    boxShadow: [
                      "0 0 8px hsla(152, 68%, 45%, 0.15)",
                      "0 0 20px hsla(152, 68%, 45%, 0.3)",
                      "0 0 8px hsla(152, 68%, 45%, 0.15)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="font-display text-lg font-bold text-primary">
                    <AnimatedScore target={data.compatibility} isVisible={isExpanded} />%
                  </span>
                </motion.div>
              </motion.div>

              {/* Molecular compound tags */}
              <motion.div
                className="flex flex-wrap gap-1.5 mb-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
              >
                {data.compounds.map((compound, i) => (
                  <motion.span
                    key={compound}
                    className="inline-flex items-center rounded-md border border-border/40 bg-secondary/30 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.08, type: "spring", damping: 15 }}
                  >
                    {compound}
                  </motion.span>
                ))}
              </motion.div>

              {/* Explanation */}
              <motion.p
                className="text-[11px] text-muted-foreground leading-relaxed italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {data.reason}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Pre-configured panel for the swipe deck
export function SwipeCardSubstitution() {
  return (
    <ExpandableSubstitution
      data={{
        missing: "Fresh Basil",
        substitute: "Dried Oregano",
        compatibility: 91,
        compounds: ["Linalool", "Eugenol", "Cineole"],
        reason: "Matched via shared aromatic terpene compounds from FlavorDB.",
      }}
    />
  )
}
