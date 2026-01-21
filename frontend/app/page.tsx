"use client"

import React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Send, 
  Bot, 
  User, 
  Train, 
  Car, 
  MapPin, 
  LogOut,
  Menu,
  X,
  Settings,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { sendMessageToAgent } from "@/lib/agent-client"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  message: string
}

const quickActions: QuickAction[] = [
  {
    id: "taxi",
    label: "Réserver un taxi",
    icon: <Car className="h-4 w-4" />,
    message: "Je souhaite réserver un taxi pour me rendre à la gare.",
  },
  {
    id: "train",
    label: "Mon prochain train",
    icon: <Train className="h-4 w-4" />,
    message: "Quelles sont les informations de mon prochain train ?",
  },
  {
    id: "traffic",
    label: "État du trafic",
    icon: <MapPin className="h-4 w-4" />,
    message: "Quel est l'état du trafic vers la gare ?",
  },
]

export default function TravelerChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant SNCF. Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous aider à réserver un taxi, vérifier l'état du trafic ou vous donner des informations sur votre prochain train.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }, [])

  useEffect(() => {
    scrollToBottom("auto")
  }, [messages, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }, [])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await sendMessageToAgent(content, {
        tripId: "1",
        trainNumber: "TGV 6241",
        departureStation: "Paris Gare de Lyon",
        departureTime: "08:47",
      })

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }, [isLoading])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const handleLogout = () => {
    router.push("/login")
  }

  const handleSwitchToAdmin = () => {
    router.push("/admin")
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[oklch(0.96_0.02_240)] via-[oklch(0.98_0.01_240)] to-[oklch(0.96_0.02_250)]">
      {/* Header */}
      <header className="flex-shrink-0 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Train className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg">SNCF Assistant</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
              onClick={handleSwitchToAdmin}
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-primary-foreground/20 px-4 py-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleSwitchToAdmin}
            >
              <Settings className="h-4 w-4 mr-2" />
              Espace Admin
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden relative">
        {/* Messages - Scrollable container */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
        >
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-card-foreground rounded-bl-md border border-border"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-2 opacity-60",
                    message.role === "user" ? "text-right" : "text-left"
                  )}>
                    {message.timestamp.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                    <User className="h-5 w-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 border border-border shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <Button
            onClick={() => scrollToBottom()}
            size="icon"
            className="absolute bottom-36 right-6 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-10"
          >
            <ChevronDown className="h-5 w-5" />
            <span className="sr-only">Défiler vers le bas</span>
          </Button>
        )}

        {/* Quick Actions */}
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="flex-shrink-0 gap-2 text-sm bg-card hover:bg-primary hover:text-primary-foreground transition-colors border-border"
                onClick={() => handleSendMessage(action.message)}
                disabled={isLoading}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 bg-card/50 backdrop-blur-sm border-t border-border">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-card border-border focus-visible:ring-primary h-11"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="h-11 px-4"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
