"use client"

import Link from "next/link"
import { Bell, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const unreadCount = notifications.filter((n) => !n.read).length

  // Check WebSocket connection status
  useEffect(() => {
    // This is a simple way to check if the WebSocket is connected
    // In a real app, you would use a more robust method or state from Redux
    const checkConnection = () => {
      // For demo purposes, we'll just randomly set the connection status
      // In a real app, this would come from your WebSocket provider state
      const isConnected = localStorage.getItem("wsConnected") === "true"
      setWsConnected(isConnected)
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">CryptoWeather</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/favorites" className="text-sm font-medium transition-colors hover:text-primary">
              Favorites
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            {wsConnected ? (
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                <Wifi className="h-3 w-3" />
                <span className="text-xs">Live</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                <WifiOff className="h-3 w-3" />
                <span className="text-xs">Simulated</span>
              </Badge>
            )}
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
          </div>
        </div>
      </div>
    </header>
  )
}

