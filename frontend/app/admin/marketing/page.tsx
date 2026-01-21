"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KpiCard } from "@/components/admin/kpi-card"
import { 
  Megaphone, 
  Users, 
  Target, 
  Mail,
  Bell,
  Smartphone,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  MoreHorizontal
} from "lucide-react"

const campaignData = [
  { 
    id: 1, 
    name: "Promo Été TGV", 
    status: "active", 
    reach: 12450, 
    conversions: 342, 
    rate: 2.7,
    channel: "push"
  },
  { 
    id: 2, 
    name: "Offre Taxi Partenaire", 
    status: "active", 
    reach: 8920, 
    conversions: 567, 
    rate: 6.4,
    channel: "email"
  },
  { 
    id: 3, 
    name: "Nouveaux Horaires Lyon", 
    status: "paused", 
    reach: 5430, 
    conversions: 89, 
    rate: 1.6,
    channel: "sms"
  },
  { 
    id: 4, 
    name: "Programme Fidélité", 
    status: "scheduled", 
    reach: 0, 
    conversions: 0, 
    rate: 0,
    channel: "email"
  },
]

const kpiMarketing = {
  totalReach: 26800,
  reachTrend: 15.2,
  avgConversionRate: 3.6,
  conversionTrend: 0.8,
  activeCampaigns: 2,
  campaignsTrend: 1,
  engagementRate: 24.5,
  engagementTrend: 3.2,
}

export default function MarketingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing</h1>
          <p className="text-muted-foreground mt-1">Gérez vos campagnes et communications</p>
        </div>
        <Button>
          <Megaphone className="h-4 w-4 mr-2" />
          Nouvelle campagne
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Portée totale"
          value={kpiMarketing.totalReach.toLocaleString("fr-FR")}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: kpiMarketing.reachTrend, isPositive: true }}
          description="utilisateurs touchés"
        />
        <KpiCard
          title="Taux de conversion"
          value={`${kpiMarketing.avgConversionRate}%`}
          icon={<Target className="h-5 w-5" />}
          trend={{ value: kpiMarketing.conversionTrend, isPositive: true }}
          description="moyenne campagnes"
        />
        <KpiCard
          title="Campagnes actives"
          value={kpiMarketing.activeCampaigns}
          icon={<Megaphone className="h-5 w-5" />}
          trend={{ value: kpiMarketing.campaignsTrend, isPositive: true }}
          description="en cours"
        />
        <KpiCard
          title="Taux d'engagement"
          value={`${kpiMarketing.engagementRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: kpiMarketing.engagementTrend, isPositive: true }}
          description="interactions"
        />
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campagnes</CardTitle>
          <CardDescription>Gérez vos campagnes marketing en cours et planifiées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Campagne</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Canal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Portée</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversions</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Taux</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{campaign.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {campaign.channel === "email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                        {campaign.channel === "push" && <Bell className="h-4 w-4 text-muted-foreground" />}
                        {campaign.channel === "sms" && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                        <span className="text-sm text-muted-foreground capitalize">{campaign.channel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === "active" ? "bg-green-100 text-green-700" :
                        campaign.status === "paused" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {campaign.status === "active" ? "Active" : 
                         campaign.status === "paused" ? "En pause" : "Planifiée"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-foreground">
                      {campaign.reach.toLocaleString("fr-FR")}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-foreground">
                      {campaign.conversions.toLocaleString("fr-FR")}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-foreground">
                      {campaign.rate}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {campaign.status === "active" ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : campaign.status === "paused" ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taux d'ouverture</span>
                <span className="font-medium">32.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taux de clic</span>
                <span className="font-medium">8.7%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Désabonnements</span>
                <span className="font-medium">0.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Notifications Push
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taux de livraison</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taux d'ouverture</span>
                <span className="font-medium">18.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Opt-out</span>
                <span className="font-medium">1.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              SMS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taux de livraison</span>
                <span className="font-medium">98.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taux de réponse</span>
                <span className="font-medium">4.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coût moyen</span>
                <span className="font-medium">0.08 EUR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
