"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive?: boolean
  }
  icon?: React.ReactNode
  className?: string
}

export function KpiCard({ title, value, description, trend, icon, className }: KpiCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.isPositive) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getTrendColor = () => {
    if (!trend) return ""
    return trend.isPositive ? "text-green-600" : "text-red-600"
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-1 mt-1">
            {trend && (
              <>
                {getTrendIcon()}
                <span className={cn("text-xs font-medium", getTrendColor())}>
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
              </>
            )}
            {description && (
              <span className="text-xs text-muted-foreground ml-1">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Also export as KPICard for backwards compatibility
