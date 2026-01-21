"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Sample data - would come from Databricks analytics in production
const dailyUsageData = [
  { date: "Lun", value: 4.1 },
  { date: "Mar", value: 4.3 },
  { date: "Mer", value: 4.0 },
  { date: "Jeu", value: 4.4 },
  { date: "Ven", value: 4.2 },
  { date: "Sam", value: 4.5 },
  { date: "Dim", value: 4.3 },
]

const hourlyUsageData = [
  { hour: "6h", count: 23 },
  { hour: "7h", count: 89 },
  { hour: "8h", count: 156 },
  { hour: "9h", count: 134 },
  { hour: "10h", count: 98 },
  { hour: "11h", count: 87 },
  { hour: "12h", count: 112 },
  { hour: "13h", count: 145 },
  { hour: "14h", count: 123 },
  { hour: "15h", count: 134 },
  { hour: "16h", count: 178 },
  { hour: "17h", count: 198 },
  { hour: "18h", count: 167 },
  { hour: "19h", count: 89 },
  { hour: "20h", count: 56 },
  { hour: "21h", count: 34 },
]

interface UsageChartProps {
  type?: "daily" | "hourly"
  title?: string
}

export function UsageChart({ type = "daily", title }: UsageChartProps) {
  if (type === "daily") {
    return (
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyUsageData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.5 0.2 250)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.5 0.2 250)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 240)" />
            <XAxis
              dataKey="date"
              stroke="oklch(0.45 0.02 240)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.45 0.02 240)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid oklch(0.9 0.02 240)",
                borderRadius: "8px",
                color: "oklch(0.15 0.03 240)",
              }}
              formatter={(value: number) => [`${value}/5`, "Score"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Score"
              stroke="oklch(0.5 0.2 250)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={hourlyUsageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 240)" />
          <XAxis
            dataKey="hour"
            stroke="oklch(0.45 0.02 240)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="oklch(0.45 0.02 240)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid oklch(0.9 0.02 240)",
              borderRadius: "8px",
              color: "oklch(0.15 0.03 240)",
            }}
          />
          <Bar
            dataKey="count"
            name="Interactions"
            fill="oklch(0.5 0.2 250)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
