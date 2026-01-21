import { NextRequest, NextResponse } from "next/server"

/**
 * Analytics API Route Handler
 * 
 * This endpoint provides KPI and analytics data for the admin dashboard.
 * In production, replace with actual Databricks SQL queries.
 */

export interface AnalyticsData {
  kpis: {
    totalConversations: number
    conversationsTrend: number
    taxiConversionRate: number
    conversionTrend: number
    avgAnticipationTime: number
    anticipationTrend: number
    activeUsers: number
    usersTrend: number
  }
  dailyUsage: Array<{
    date: string
    conversations: number
    reservations: number
  }>
  hourlyUsage: Array<{
    hour: string
    count: number
  }>
  requestDistribution: Array<{
    name: string
    value: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "7d"

    // In production, query Databricks SQL endpoint:
    //
    // const databricksResponse = await fetch(
    //   `${process.env.DATABRICKS_SQL_ENDPOINT}/analytics?period=${period}`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.DATABRICKS_API_TOKEN}`,
    //     },
    //   }
    // )
    // const data = await databricksResponse.json()
    // return NextResponse.json(data)

    // Mock data for demonstration
    const analyticsData: AnalyticsData = {
      kpis: {
        totalConversations: 1966,
        conversationsTrend: 12.5,
        taxiConversionRate: 38.2,
        conversionTrend: 5.3,
        avgAnticipationTime: 52,
        anticipationTrend: -3.2,
        activeUsers: 847,
        usersTrend: 8.7,
      },
      dailyUsage: [
        { date: "Lun", conversations: 245, reservations: 89 },
        { date: "Mar", conversations: 312, reservations: 112 },
        { date: "Mer", conversations: 287, reservations: 98 },
        { date: "Jeu", conversations: 356, reservations: 134 },
        { date: "Ven", conversations: 421, reservations: 156 },
        { date: "Sam", conversations: 189, reservations: 67 },
        { date: "Dim", conversations: 156, reservations: 45 },
      ],
      hourlyUsage: [
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
      ],
      requestDistribution: [
        { name: "Réservation taxi", value: 42 },
        { name: "Info trafic", value: 28 },
        { name: "Info train", value: 18 },
        { name: "Info quai", value: 8 },
        { name: "Autres", value: 4 },
      ],
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("[v0] Analytics API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
