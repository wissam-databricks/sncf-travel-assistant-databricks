"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiCard } from "@/components/admin/kpi-card"
import { UsageChart } from "@/components/admin/usage-chart"
import { RequestDistributionChart } from "@/components/admin/request-distribution-chart"
import { 
  BarChart3, 
  MessageSquare, 
  Car, 
  Clock,
  Users,
  Zap,
  Globe,
  Smartphone
} from "lucide-react"

const analyticsKpis = {
  totalConversations: 12847,
  conversationsTrend: 18.3,
  avgResponseTime: 1.2,
  responseTrend: -0.3,
  taxiBookings: 2341,
  taxiTrend: 24.5,
  activeUsers: 4523,
  usersTrend: 12.1,
}

const topRoutes = [
  { route: "Paris - Lyon", conversations: 2341, percentage: 18.2 },
  { route: "Paris - Marseille", conversations: 1876, percentage: 14.6 },
  { route: "Paris - Bordeaux", conversations: 1543, percentage: 12.0 },
  { route: "Lyon - Marseille", conversations: 987, percentage: 7.7 },
  { route: "Paris - Lille", conversations: 876, percentage: 6.8 },
]

const deviceStats = {
  mobile: 68,
  desktop: 27,
  tablet: 5,
}

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Analysez les performances et l'utilisation de l'assistant</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Conversations totales"
          value={analyticsKpis.totalConversations.toLocaleString("fr-FR")}
          icon={<MessageSquare className="h-5 w-5" />}
          trend={{ value: analyticsKpis.conversationsTrend, isPositive: true }}
          description="ce mois"
        />
        <KpiCard
          title="Temps de réponse"
          value={`${analyticsKpis.avgResponseTime}s`}
          icon={<Zap className="h-5 w-5" />}
          trend={{ value: Math.abs(analyticsKpis.responseTrend), isPositive: true }}
          description="moyenne"
        />
        <KpiCard
          title="Réservations taxi"
          value={analyticsKpis.taxiBookings.toLocaleString("fr-FR")}
          icon={<Car className="h-5 w-5" />}
          trend={{ value: analyticsKpis.taxiTrend, isPositive: true }}
          description="ce mois"
        />
        <KpiCard
          title="Utilisateurs actifs"
          value={analyticsKpis.activeUsers.toLocaleString("fr-FR")}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: analyticsKpis.usersTrend, isPositive: true }}
          description="ce mois"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Activité quotidienne
            </CardTitle>
            <CardDescription>Conversations sur les 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Distribution horaire
            </CardTitle>
            <CardDescription>Répartition des interactions par heure</CardDescription>
          </CardHeader>
          <CardContent>
            <RequestDistributionChart />
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Routes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Trajets populaires
            </CardTitle>
            <CardDescription>Les itinéraires les plus consultés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRoutes.map((route, index) => (
                <div key={route.route} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{route.route}</span>
                      <span className="text-sm text-muted-foreground">{route.conversations.toLocaleString("fr-FR")} conv.</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${route.percentage * 5}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">
                    {route.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Appareils
            </CardTitle>
            <CardDescription>Répartition par type d'appareil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Mobile</span>
                  <span className="text-sm font-medium">{deviceStats.mobile}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${deviceStats.mobile}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Desktop</span>
                  <span className="text-sm font-medium">{deviceStats.desktop}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-2 rounded-full" style={{ width: `${deviceStats.desktop}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Tablet</span>
                  <span className="text-sm font-medium">{deviceStats.tablet}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-3 rounded-full" style={{ width: `${deviceStats.tablet}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Sessions moyennes</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">3.2</p>
                  <p className="text-xs text-muted-foreground">messages/session</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4:32</p>
                  <p className="text-xs text-muted-foreground">durée moyenne</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
