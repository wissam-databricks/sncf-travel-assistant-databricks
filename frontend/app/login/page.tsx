"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Train, User, Shield, ArrowRight, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [travelerForm, setTravelerForm] = useState({ email: "", password: "" })
  const [adminForm, setAdminForm] = useState({ email: "", password: "" })

  const handleTravelerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login - in production, this would call an auth API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/")
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login - in production, this would call an auth API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.95_0.02_240)] via-[oklch(0.98_0.01_240)] to-[oklch(0.95_0.03_250)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Train className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SNCF Assistant</h1>
          <p className="text-muted-foreground mt-1">Connectez-vous pour continuer</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <Tabs defaultValue="traveler" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="traveler" className="gap-2">
                  <User className="h-4 w-4" />
                  Voyageur
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traveler">
                <CardTitle className="text-xl">Espace Voyageur</CardTitle>
                <CardDescription className="mt-1">
                  Accédez à votre assistant de voyage personnalisé
                </CardDescription>
              </TabsContent>

              <TabsContent value="admin">
                <CardTitle className="text-xl">Espace Administrateur</CardTitle>
                <CardDescription className="mt-1">
                  Gérez et analysez les performances de l'assistant
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="traveler" className="w-full">
              <TabsContent value="traveler" className="mt-0">
                <form onSubmit={handleTravelerLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="traveler-email">Email</Label>
                    <Input
                      id="traveler-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={travelerForm.email}
                      onChange={(e) => setTravelerForm({ ...travelerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traveler-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="traveler-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        value={travelerForm.password}
                        onChange={(e) => setTravelerForm({ ...travelerForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-muted-foreground">Se souvenir de moi</span>
                    </label>
                    <a href="#" className="text-primary hover:underline">Mot de passe oublié ?</a>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Se connecter"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Créer un compte</a>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="mt-0">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email professionnel</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="operateur@sncf.fr"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion..." : "Accéder au dashboard"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-6 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Accès restreint</p>
                  <p>Contactez votre administrateur si vous avez besoin d'accès.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          En vous connectant, vous acceptez nos{" "}
          <a href="#" className="underline hover:text-foreground">conditions d'utilisation</a>
          {" "}et notre{" "}
          <a href="#" className="underline hover:text-foreground">politique de confidentialité</a>.
        </p>
      </div>
    </div>
  )
}
