"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  Bell, 
  Shield, 
  Database,
  Bot,
  Save,
  RefreshCw
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
  })

  const [chatbotSettings, setChatbotSettings] = useState({
    autoGreeting: true,
    proactiveSuggestions: true,
    taxiReminder: true,
    reminderMinutes: "45",
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Configurez les paramètres de l'assistant SNCF</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Gérez vos préférences de notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Notifications email</Label>
                <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
              </div>
              <Switch
                id="email-notif"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notif">Notifications push</Label>
                <p className="text-sm text-muted-foreground">Recevoir les alertes en temps réel</p>
              </div>
              <Switch
                id="push-notif"
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notif">Notifications SMS</Label>
                <p className="text-sm text-muted-foreground">Recevoir les alertes critiques par SMS</p>
              </div>
              <Switch
                id="sms-notif"
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-report">Rapport hebdomadaire</Label>
                <p className="text-sm text-muted-foreground">Recevoir un résumé chaque lundi</p>
              </div>
              <Switch
                id="weekly-report"
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chatbot Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Configuration Chatbot
            </CardTitle>
            <CardDescription>Personnalisez le comportement de l'assistant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-greeting">Message d'accueil automatique</Label>
                <p className="text-sm text-muted-foreground">Saluer les voyageurs automatiquement</p>
              </div>
              <Switch
                id="auto-greeting"
                checked={chatbotSettings.autoGreeting}
                onCheckedChange={(checked) => setChatbotSettings({ ...chatbotSettings, autoGreeting: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="proactive">Suggestions proactives</Label>
                <p className="text-sm text-muted-foreground">Proposer des actions pertinentes</p>
              </div>
              <Switch
                id="proactive"
                checked={chatbotSettings.proactiveSuggestions}
                onCheckedChange={(checked) => setChatbotSettings({ ...chatbotSettings, proactiveSuggestions: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="taxi-reminder">Rappel taxi</Label>
                <p className="text-sm text-muted-foreground">Proposer la réservation de taxi</p>
              </div>
              <Switch
                id="taxi-reminder"
                checked={chatbotSettings.taxiReminder}
                onCheckedChange={(checked) => setChatbotSettings({ ...chatbotSettings, taxiReminder: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Délai rappel taxi (minutes)</Label>
              <Input
                id="reminder-time"
                type="number"
                value={chatbotSettings.reminderMinutes}
                onChange={(e) => setChatbotSettings({ ...chatbotSettings, reminderMinutes: e.target.value })}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground">Temps avant le départ pour proposer un taxi</p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Sécurité
            </CardTitle>
            <CardDescription>Paramètres de sécurité et d'accès</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" placeholder="Entrez votre mot de passe actuel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" placeholder="Entrez un nouveau mot de passe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" placeholder="Confirmez le nouveau mot de passe" />
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Mettre à jour le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* API & Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              API et Intégrations
            </CardTitle>
            <CardDescription>Configuration des connexions externes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Databricks</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Connecté</span>
              </div>
              <p className="text-xs text-muted-foreground">Agent Serving API</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SNCF API</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Connecté</span>
              </div>
              <p className="text-xs text-muted-foreground">Horaires et informations trains</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Partenaire Taxi</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Connecté</span>
              </div>
              <p className="text-xs text-muted-foreground">Réservation et disponibilités</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tester les connexions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  )
}
