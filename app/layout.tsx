import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/redux/provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WebSocketProvider } from "@/components/websocket-provider"
import { FavoritesManager } from "@/components/favorites/favorites-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CryptoWeather Nexus",
  description: "Dashboard combining weather data, cryptocurrency information, and real-time notifications",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <WebSocketProvider>
              <FavoritesManager />
              {children}
              <Toaster />
            </WebSocketProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

