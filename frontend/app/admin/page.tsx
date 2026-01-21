"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiCard } from "@/components/admin/kpi-card"
import { UsageChart } from "@/components/admin/usage-chart"
import { 
  Smile, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  TrendingUp,
  Star
} from "lucide-react"

// Sample satisfaction data
const satisfactionData = {
  overallScore: 4.2,
  totalResponses: 1247,
  positive: 892,
  neutral: 243,
  negative: 112,
  nps: 67,
}

const recentFeedback = [
  { id: 1, score: 5, comment: "Très pratique pour réserver mon taxi, merci !", date: "Il y a 2h" },
  { id: 2, score: 4, comment: "Bon service, réponses rapides.", date: "Il y a 3h" },
  { id: 3, score: 3, comment: "Utile mais parfois les horaires ne sont pas à jour.", date: "Il y a 5h" },
  { id: 4, score: 5, comment: "Excellent assistant, je l'utilise à chaque voyage.", date: "Il y a 6h" },
  { id: 5, score: 2, comment: "La réservation taxi n'a pas fonctionné.", date: "Il y a 8h" },
]

export default function SatisfactionPage() {
  const positivePercent = Math.round((satisfactionData.positive / satisfactionData.totalResponses) * 100)
  const negativePercent = Math.round((satisfactionData.negative / satisfactionData.totalResponses) * 100)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Satisfaction Client</h1>
        <p className="text-muted-foreground mt-1">Suivez la satisfaction des voyageurs avec l'assistant SNCF</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Score Global"
          value={`${satisfactionData.overallScore}/5`}
          icon={<Star className="h-5 w-5" />}
          trend={{ value: 0.3, isPositive: true }}
          description="Note moyenne"
        />
        <KpiCard
          title="Avis Positifs"
          value={`${positivePercent}%`}
          icon={<ThumbsUp className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
          description={`${satisfactionData.positive} avis`}
        />
        <KpiCard
          title="Avis Négatifs"
          value={`${negativePercent}%`}
          icon={<ThumbsDown className="h-5 w-5" />}
          trend={{ value: 2, isPositive: false }}
          description={`${satisfactionData.negative} avis`}
        />
        <KpiCard
          title="NPS Score"
          value={satisfactionData.nps}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          description="Net Promoter Score"
        />
      </div>

      {/* Charts and Feedback */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Satisfaction Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-primary" />
              Évolution de la satisfaction
            </CardTitle>
            <CardDescription>Score moyen sur les 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart />
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Derniers avis
            </CardTitle>
            <CardDescription>Retours récents des voyageurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    feedback.score >= 4 ? 'bg-green-100 text-green-700' :
                    feedback.score >= 3 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {feedback.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{feedback.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{feedback.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Satisfaction Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des notes</CardTitle>
          <CardDescription>Distribution des scores de satisfaction sur {satisfactionData.totalResponses} réponses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = score === 5 ? 523 : score === 4 ? 369 : score === 3 ? 243 : score === 2 ? 78 : 34
              const percent = Math.round((count / satisfactionData.totalResponses) * 100)
              return (
                <div key={score} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{score}</span>
                  </div>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm text-muted-foreground">
                    {percent}%
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
