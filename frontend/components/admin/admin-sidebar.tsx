"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Smile,
  Megaphone,
  BarChart3,
  Settings,
  Train,
  LogOut,
  MessageCircle,
} from "lucide-react"

const navItems = [
  {
    title: "Satisfaction Client",
    href: "/admin",
    icon: Smile,
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: Megaphone,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Train className="h-7 w-7 text-sidebar-primary" />
          <span className="font-bold text-lg text-sidebar-foreground">SNCF Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start bg-sidebar-primary/10 border-sidebar-primary/30 text-sidebar-foreground hover:bg-sidebar-primary/20"
          onClick={() => router.push("/")}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Vue Voyageur
        </Button>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-medium">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Opérateur SNCF</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">operateur@sncf.fr</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
