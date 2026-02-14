"use client"

import { TrendingUp, Leaf, DollarSign, Weight } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const savingsData = [
  { month: "Jan", savings: 12 },
  { month: "Feb", savings: 19 },
  { month: "Mar", savings: 28 },
  { month: "Apr", savings: 35 },
  { month: "May", savings: 42 },
  { month: "Jun", savings: 55 },
  { month: "Jul", savings: 68 },
  { month: "Aug", savings: 82 },
]

export function WasteMetrics() {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Sustainability Impact</h3>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard
          icon={<Leaf className="h-4 w-4" />}
          label="Ingredients Used"
          value="47"
          trend="+12%"
          trendUp
        />
        <MetricCard
          icon={<Weight className="h-4 w-4" />}
          label="Waste Prevented"
          value="1.8 lbs"
          trend="-24%"
          trendUp
          barValue={68}
        />
        <MetricCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Money Saved"
          value="$34.20"
          trend="+8%"
          trendUp
        />
      </div>

      {/* Chart */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-4">Projected Household Savings</h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
                axisLine={{ stroke: "hsl(222 30% 16%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
                axisLine={{ stroke: "hsl(222 30% 16%)" }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 44% 9%)",
                  border: "1px solid hsl(222 30% 16%)",
                  borderRadius: "8px",
                  color: "hsl(210 40% 96%)",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`$${value}`, "Savings"]}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="hsl(152 68% 45%)"
                strokeWidth={2}
                dot={{ fill: "hsl(152 68% 45%)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6 italic">
        Small decisions. Massive environmental impact.
      </p>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  barValue,
}: {
  icon: React.ReactNode
  label: string
  value: string
  trend: string
  trendUp: boolean
  barValue?: number
}) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-primary">{icon}</div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-display text-2xl font-bold text-foreground">{value}</span>
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium mb-1 ${trendUp ? "text-primary" : "text-destructive"}`}>
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
      </div>
      {barValue !== undefined && (
        <div className="mt-2 w-full h-1.5 rounded-full bg-secondary/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${barValue}%`,
              background: "linear-gradient(90deg, hsl(0 72% 51%), hsl(152 68% 45%))",
            }}
          />
        </div>
      )}
    </div>
  )
}
