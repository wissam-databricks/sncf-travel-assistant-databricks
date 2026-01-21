"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

// Sample hourly data
const hourlyData = [
  { hour: "6h", count: 12 },
  { hour: "7h", count: 45 },
  { hour: "8h", count: 89 },
  { hour: "9h", count: 67 },
  { hour: "10h", count: 54 },
  { hour: "11h", count: 43 },
  { hour: "12h", count: 56 },
  { hour: "13h", count: 78 },
  { hour: "14h", count: 65 },
  { hour: "15h", count: 72 },
  { hour: "16h", count: 98 },
  { hour: "17h", count: 112 },
  { hour: "18h", count: 87 },
  { hour: "19h", count: 45 },
  { hour: "20h", count: 23 },
  { hour: "21h", count: 12 },
]

export function RequestDistributionChart() {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 240)" />
          <XAxis
            dataKey="hour"
            stroke="oklch(0.45 0.02 240)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="oklch(0.45 0.02 240)"
            fontSize={11}
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
            formatter={(value: number) => [value, "Interactions"]}
          />
          <Bar
            dataKey="count"
            name="Interactions"
            fill="oklch(0.6 0.15 200)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
