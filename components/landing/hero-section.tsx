"use client"

import { ArrowRight, Leaf, FlaskConical, BarChart3 } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-8 animate-fade-in-up">
          <Leaf className="h-3.5 w-3.5 text-primary" />
          <span>Powered by RecipeDB + FlavorDB</span>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-foreground">40% of Food Waste</span>
          <br />
          <span className="text-primary">Happens at Home.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          We turn your fridge into intelligent meals. Ingredient-first matching, molecular substitutions, and waste reduction scoring.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:brightness-110 glow-green"
          >
            Try SmartChef
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 text-base font-medium text-foreground transition-all hover:bg-secondary"
          >
            See How It Works
          </a>
        </div>

        {/* Feature blocks */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            icon={<Leaf className="h-5 w-5" />}
            title="Ingredient-First Matching"
            description="Start with what you have, not what you need. Our algorithm ranks recipes by fridge utilization."
            delay="0.4s"
          />
          <FeatureCard
            icon={<FlaskConical className="h-5 w-5" />}
            title="Molecular Substitutions"
            description="Missing something? Our FlavorDB engine finds scientifically compatible replacements."
            delay="0.5s"
          />
          <FeatureCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Waste Reduction Scoring"
            description="Track your environmental impact with real-time fridge utilization and savings metrics."
            delay="0.6s"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: string
}) {
  return (
    <div
      className="glass-card glass-card-hover rounded-xl p-6 text-left animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
