import { HeroSection } from "@/components/landing/hero-section"
import { ComparisonSection } from "@/components/landing/comparison-section"
import { Leaf } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">SmartChef AI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a
              href="/dashboard"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all"
            >
              Launch App
            </a>
          </div>
        </div>
      </nav>

      <HeroSection />
      <ComparisonSection />

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-semibold text-foreground">SmartChef AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Small decisions. Massive environmental impact.
          </p>
        </div>
      </footer>
    </main>
  )
}
