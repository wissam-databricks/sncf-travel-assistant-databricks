import { NextRequest, NextResponse } from "next/server"
import { SNCF_AGENT_SYSTEM_PROMPT } from "@/lib/agent-client"

/**
 * Chat API Route Handler
 * 
 * This endpoint serves as the integration point for the Databricks AI Agent.
 * In production, replace the mock response with actual Databricks API calls.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // In production, call Databricks Agent Serving endpoint:
    // 
    // const databricksResponse = await fetch(process.env.DATABRICKS_AGENT_ENDPOINT!, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.DATABRICKS_API_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     inputs: {
    //       messages: [
    //         { role: 'system', content: SNCF_AGENT_SYSTEM_PROMPT },
    //         { role: 'user', content: message }
    //       ],
    //       context: context,
    //     }
    //   }),
    // })
    // 
    // const data = await databricksResponse.json()
    // return NextResponse.json({ response: data.predictions[0].message })

    // Mock response for demonstration
    const response = await generateMockResponse(message, context)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function generateMockResponse(
  message: string,
  context?: { trainNumber?: string; departureStation?: string; departureTime?: string }
): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("taxi") || lowerMessage.includes("réserver")) {
    return `Bien sûr ! Je vois que vous avez un train ${context?.trainNumber || "TGV"} qui part à ${context?.departureTime || "bientôt"} de ${context?.departureStation || "la gare"}.

Pour organiser votre taxi, j'aurais besoin de quelques informations :
1. Quelle est votre adresse de prise en charge ?
2. Avez-vous une préférence pour le type de véhicule ?`
  }

  if (lowerMessage.includes("train") || lowerMessage.includes("prochain")) {
    return `Voici les informations de votre prochain voyage :

Train ${context?.trainNumber || "TGV 6241"}
Départ : ${context?.departureStation || "Paris Gare de Lyon"} à ${context?.departureTime || "08:47"}
Voie : K

Tout est à l'heure pour l'instant. Puis-je vous aider à préparer votre trajet ?`
  }

  if (lowerMessage.includes("trafic") || lowerMessage.includes("circulation")) {
    return `Voici l'état du trafic vers ${context?.departureStation || "la gare"} :

Trafic routier : Fluide
Métro : Service normal
Temps estimé depuis le centre : 20-25 minutes

Je vous recommande de partir 30 minutes avant le départ. Voulez-vous réserver un taxi ?`
  }

  return `Je suis votre assistant SNCF. Comment puis-je vous aider ?

- Réserver un taxi
- Vérifier l'état du trafic
- Informations sur votre train`
}

// Export system prompt for reference
export { SNCF_AGENT_SYSTEM_PROMPT }
