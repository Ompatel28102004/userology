"use client"

import Link from "next/link"
import { Bell, Wifi, WifiOff, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)

  let notifications: any[] = []
  let unreadCount = 0

  try {
    const reduxState = useSelector((state: RootState) => state.notifications)
    notifications = reduxState.items
    unreadCount = notifications.filter((n) => !n.read).length
  } catch (error) {
    console.error("Redux not available:", error)
    notifications = []
    unreadCount = 0
  }

  useEffect(() => {
    const checkConnection = () => {
      try {
        const isConnected = localStorage.getItem("wsConnected") === "true"
        setWsConnected(isConnected)
      } catch (error) {
        console.error("Error checking WebSocket connection:", error)
        setWsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-lg font-medium hover:text-primary">Dashboard</Link>
                <Link href="/favorites" className="text-lg font-medium hover:text-primary">Favorites</Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">CryptoWeather</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            <Link href="/favorites" className="text-sm font-medium hover:text-primary">Favorites</Link>
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
            {showNotifications && (
              <div className="">
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}