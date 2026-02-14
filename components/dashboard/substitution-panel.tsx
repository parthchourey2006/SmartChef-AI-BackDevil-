"use client"

import { FlaskConical, AlertCircle, CheckCircle2 } from "lucide-react"

interface Substitution {
  missing: string
  substitute: string
  compatibility: number
  compounds: string[]
}

const substitutions: Substitution[] = [
  { missing: "Fresh Basil", substitute: "Dried Oregano", compatibility: 91, compounds: ["Linalool", "Eugenol", "Cineole"] },
  { missing: "Heavy Cream", substitute: "Coconut Milk", compatibility: 87, compounds: ["Decalactone", "Octanone", "Diacetyl"] },
  { missing: "Parmesan", substitute: "Nutritional Yeast", compatibility: 78, compounds: ["Glutamate", "Butyric acid", "Methional"] },
]

export function SubstitutionPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Smart Substitutions</h3>
      </div>

      <div className="space-y-3">
        {substitutions.map((sub, i) => (
          <div
            key={sub.missing}
            className="glass-card rounded-xl p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {/* Missing → Substitute */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-xs text-destructive font-medium">Not in Fridge</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{sub.missing}</p>
              </div>

              <div className="flex-shrink-0 w-8 flex items-center justify-center">
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="text-muted-foreground">
                  <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex-1 text-right">
                <div className="flex items-center gap-1.5 justify-end mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-primary font-medium">FlavorDB Match</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{sub.substitute}</p>
              </div>
            </div>

            {/* Compatibility */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground">Flavor Compatibility:</span>
              <span className="text-xs font-semibold text-primary">{sub.compatibility}%</span>
              <div className="flex-1 h-1 rounded-full bg-secondary/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000"
                  style={{ width: `${sub.compatibility}%` }}
                />
              </div>
            </div>

            {/* Molecular compounds */}
            <div className="flex flex-wrap gap-1.5">
              {sub.compounds.map((compound) => (
                <span
                  key={compound}
                  className="inline-flex items-center rounded-md border border-border/40 bg-secondary/30 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                >
                  {compound}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed italic">
              Matched using shared molecular compounds.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Detailed Substitution Science Card (standalone)
export function SubstitutionSciencePanel() {
  const sub = substitutions[0]

  return (
    <div className="glass-card glow-green rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <FlaskConical className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Substitution Intelligence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-8">
        {/* Missing */}
        <div className="glass-card rounded-xl p-5 text-center">
          <span className="inline-flex items-center rounded-md bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive mb-3">
            Not in Fridge
          </span>
          <p className="font-display text-lg font-bold text-foreground">{sub.missing}</p>
          <p className="text-xs text-muted-foreground mt-1">Missing Ingredient</p>
        </div>

        {/* Molecular diagram */}
        <div className="flex items-center justify-center">
          <MolecularDiagram compounds={sub.compounds} compatibility={sub.compatibility} />
        </div>

        {/* Substitute */}
        <div className="glass-card rounded-xl p-5 text-center">
          <span className="inline-flex items-center rounded-md bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary mb-3">
            FlavorDB Match
          </span>
          <p className="font-display text-lg font-bold text-foreground">{sub.substitute}</p>
          <p className="text-xs text-muted-foreground mt-1">Compatibility Score: {sub.compatibility}%</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-lg mx-auto">
        This substitution works because both ingredients share dominant aromatic compounds, preserving core flavor structure.
      </p>
    </div>
  )
}

function MolecularDiagram({ compounds, compatibility }: { compounds: string[]; compatibility: number }) {
  const positions = [
    { x: 60, y: 20 },
    { x: 20, y: 80 },
    { x: 100, y: 80 },
  ]

  return (
    <div className="relative w-[140px] h-[120px]">
      <svg viewBox="0 0 120 100" className="w-full h-full">
        {/* Connection lines */}
        <line x1={positions[0].x} y1={positions[0].y} x2={positions[1].x} y2={positions[1].y} stroke="hsl(152 68% 45% / 0.3)" strokeWidth="1" />
        <line x1={positions[1].x} y1={positions[1].y} x2={positions[2].x} y2={positions[2].y} stroke="hsl(152 68% 45% / 0.3)" strokeWidth="1" />
        <line x1={positions[2].x} y1={positions[2].y} x2={positions[0].x} y2={positions[0].y} stroke="hsl(152 68% 45% / 0.3)" strokeWidth="1" />

        {/* Center */}
        <circle cx="60" cy="55" r="14" fill="hsl(152 68% 45% / 0.08)" stroke="hsl(152 68% 45% / 0.3)" strokeWidth="1" />
        <text x="60" y="58" textAnchor="middle" fill="hsl(152 68% 45%)" fontSize="8" fontWeight="bold">{compatibility}%</text>

        {/* Compound nodes */}
        {positions.map((pos, i) => (
          <g key={compounds[i]}>
            <circle cx={pos.x} cy={pos.y} r="6" fill="hsl(152 68% 45% / 0.15)" stroke="hsl(152 68% 45% / 0.5)" strokeWidth="1" />
            <text x={pos.x} y={pos.y + 16} textAnchor="middle" fill="hsl(215 20% 55%)" fontSize="6">{compounds[i]}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
