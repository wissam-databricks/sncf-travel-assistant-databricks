import { NextRequest, NextResponse } from "next/server"

/**
 * Trips API Route Handler
 * 
 * This endpoint provides trip information for travelers.
 * In production, replace with actual Databricks data retrieval.
 */

export interface Trip {
  id: string
  trainNumber: string
  departureStation: string
  arrivalStation: string
  departureTime: string
  arrivalTime: string
  duration: string
  platform?: string
  status: "on-time" | "delayed" | "cancelled"
  delayMinutes?: number
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // In production, query Databricks for user's trips:
    //
    // const databricksResponse = await fetch(
    //   `${process.env.DATABRICKS_SQL_ENDPOINT}/trips?userId=${userId}`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.DATABRICKS_API_TOKEN}`,
    //     },
    //   }
    // )
    // const trips = await databricksResponse.json()
    // return NextResponse.json(trips)

    // Mock data for demonstration
    const trips: Trip[] = [
      {
        id: "1",
        trainNumber: "TGV 6241",
        departureStation: "Paris Gare de Lyon",
        arrivalStation: "Lyon Part-Dieu",
        departureTime: "08:47",
        arrivalTime: "10:47",
        duration: "2h00",
        platform: "K",
        status: "on-time",
      },
      {
        id: "2",
        trainNumber: "TGV 6089",
        departureStation: "Lyon Part-Dieu",
        arrivalStation: "Marseille Saint-Charles",
        departureTime: "14:15",
        arrivalTime: "15:55",
        duration: "1h40",
        status: "on-time",
      },
    ]

    return NextResponse.json({ trips })
  } catch (error) {
    console.error("[v0] Trips API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
