"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const PARTICLE_COUNT = 8

interface Particle {
  id: number
  angle: number
  radius: number
  size: number
  duration: number
  delay: number
}

// Deterministic pseudo-random using a seed to avoid SSR/client mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  angle: (360 / PARTICLE_COUNT) * i,
  radius: 52 + seededRandom(i * 3 + 1) * 16,
  size: 3 + seededRandom(i * 3 + 2) * 3,
  duration: 3 + seededRandom(i * 3 + 3) * 2,
  delay: i * 0.15,
}))

export function LoadingState() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const phases = [
    "Analyzing Your Ingredients",
    "Scanning RecipeDB & FlavorDB...",
    "Computing Molecular Matches",
    "Ranking Optimal Recipes",
  ]

  // Smooth progress counter
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval)
          return 95
        }
        return p + Math.random() * 3 + 0.5
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Cycle through text phases
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % phases.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [phases.length])

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Central animation container */}
      <div className="relative w-40 h-40 mb-10">
        {/* Outer pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 rounded-full border border-primary/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.3 + i * 0.15],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Rotating progress track */}
        <svg className="w-full h-full" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r="65"
            fill="none"
            stroke="hsl(222 30% 14%)"
            strokeWidth="3"
          />
          {/* Progress arc */}
          <motion.circle
            cx="80"
            cy="80"
            r="65"
            fill="none"
            stroke="hsl(152 68% 45%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 65}
            initial={{ strokeDashoffset: 2 * Math.PI * 65 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 65 * (1 - progress / 100),
              rotate: [0, 360],
            }}
            transition={{
              strokeDashoffset: { duration: 0.3, ease: "easeOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            }}
            style={{
              transformOrigin: "80px 80px",
              filter: "drop-shadow(0 0 8px hsl(152 68% 45% / 0.5))",
            }}
          />
        </svg>

        {/* Orbiting green particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: "50%",
              left: "50%",
              marginTop: -p.size / 2,
              marginLeft: -p.size / 2,
              background: "hsl(152 68% 45%)",
              boxShadow: `0 0 ${p.size * 3}px hsl(152 68% 45% / 0.6)`,
            }}
            animate={{
              x: [
                Math.cos((p.angle * Math.PI) / 180) * p.radius,
                Math.cos(((p.angle + 360) * Math.PI) / 180) * p.radius,
              ],
              y: [
                Math.sin((p.angle * Math.PI) / 180) * p.radius,
                Math.sin(((p.angle + 360) * Math.PI) / 180) * p.radius,
              ],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              x: { duration: p.duration, repeat: Infinity, ease: "linear" },
              y: { duration: p.duration, repeat: Infinity, ease: "linear" },
              opacity: { duration: p.duration / 2, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: p.duration / 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display text-2xl font-bold text-foreground"
            key={Math.round(progress)}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      </div>

      {/* Animated text phases */}
      <div className="h-16 flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h3
            key={phase}
            className="font-display text-lg font-semibold text-foreground text-center animate-text-shimmer"
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {phases[phase]}
          </motion.h3>
        </AnimatePresence>

        <motion.p
          className="text-xs text-muted-foreground mt-2"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scanning RecipeDB & FlavorDB...
        </motion.p>
      </div>

      {/* Bottom subtle progress bar */}
      <motion.div
        className="w-48 h-1 rounded-full bg-secondary/40 mt-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(152 68% 35%), hsl(152 68% 50%))",
            boxShadow: "0 0 12px hsl(152 68% 45% / 0.4)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(progress, 95)}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
