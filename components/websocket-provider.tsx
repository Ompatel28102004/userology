"use client"

import { useEffect, type ReactNode, useState } from "react"
import { useDispatch } from "react-redux"
import { addNotification } from "@/redux/features/notificationsSlice"
import { updateCryptoPrice } from "@/redux/features/cryptoSlice"
import { useToast } from "@/components/ui/use-toast"

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [wsConnected, setWsConnected] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout
    let mockDataInterval: NodeJS.Timeout

    // Function to create and set up WebSocket
    const setupWebSocket = () => {
      try {
        // Clear any existing intervals
        if (mockDataInterval) clearInterval(mockDataInterval)

        // Create new WebSocket connection
        ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana")

        ws.onopen = () => {
          console.log("WebSocket connection established")
          setWsConnected(true)
          setConnectionAttempts(0) // Reset connection attempts on successful connection

          // Notify user of successful connection
          toast({
            title: "Real-time updates active",
            description: "You're now receiving live cryptocurrency updates.",
          })
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            // Process price updates
            Object.entries(data).forEach(([asset, price]) => {
              const cryptoId = asset
              const newPrice = Number.parseFloat(price as string)

              // Update crypto price in Redux store
              dispatch(updateCryptoPrice({ id: cryptoId, price: newPrice }))

              // Check for significant price changes (e.g., >2%)
              // In a real app, we'd compare with the previous price
              // Here we'll simulate notifications occasionally
              if (Math.random() < 0.1) {
                // 10% chance to show notification for demo purposes
                const priceChange = Math.random() > 0.5 ? "increased" : "decreased"
                const changePercent = (Math.random() * 5 + 1).toFixed(2)

                const notification = {
                  id: `price-${cryptoId}-${Date.now()}`,
                  type: "price_alert",
                  title: `${asset.charAt(0).toUpperCase() + asset.slice(1)} Price Alert`,
                  message: `${asset.charAt(0).toUpperCase() + asset.slice(1)} has ${priceChange} by ${changePercent}% in the last hour.`,
                  timestamp: new Date().toISOString(),
                  read: false,
                }

                dispatch(addNotification(notification))

                toast({
                  title: notification.title,
                  description: notification.message,
                })
              }
            })
          } catch (error) {
            console.error("Error processing WebSocket message:", error)
          }
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          setWsConnected(false)

          // Only show the error toast on the first few attempts to avoid spamming
          if (connectionAttempts < 2) {
            toast({
              title: "Connection issue",
              description: "Using simulated data for crypto updates. Will retry connection.",
              variant: "destructive",
            })
          }
        }

        ws.onclose = (event) => {
          console.log("WebSocket connection closed", event)
          setWsConnected(false)

          // Attempt to reconnect with exponential backoff
          const backoffTime = Math.min(30000, 1000 * Math.pow(2, connectionAttempts))
          setConnectionAttempts((prev) => prev + 1)

          reconnectTimeout = setTimeout(() => {
            if (connectionAttempts < 5) {
              // Limit reconnection attempts
              console.log(`Attempting to reconnect (${connectionAttempts + 1}/5)...`)
              setupWebSocket()
            } else {
              console.log("Max reconnection attempts reached. Using simulated data only.")
              startMockDataSimulation()
            }
          }, backoffTime)
        }
      } catch (error) {
        console.error("Error setting up WebSocket:", error)
        startMockDataSimulation()
      }
    }

    // Function to simulate WebSocket data when connection fails
    const startMockDataSimulation = () => {
      console.log("Starting mock data simulation for crypto prices")

      // Simulate crypto price updates
      mockDataInterval = setInterval(() => {
        const cryptos = ["bitcoin", "ethereum", "solana"]
        const crypto = cryptos[Math.floor(Math.random() * cryptos.length)]

        // Generate a random price with small variation
        let basePrice = 0
        switch (crypto) {
          case "bitcoin":
            basePrice = 50000
            break
          case "ethereum":
            basePrice = 3000
            break
          case "solana":
            basePrice = 100
            break
        }

        const variation = Math.random() * 0.02 - 0.01 // -1% to +1%
        const newPrice = basePrice * (1 + variation)

        dispatch(updateCryptoPrice({ id: crypto, price: newPrice }))

        // Occasionally show a notification
        if (Math.random() < 0.05) {
          const priceChange = variation >= 0 ? "increased" : "decreased"
          const changePercent = Math.abs(variation * 100).toFixed(2)

          const notification = {
            id: `price-${crypto}-${Date.now()}`,
            type: "price_alert",
            title: `${crypto.charAt(0).toUpperCase() + crypto.slice(1)} Price Alert (Simulated)`,
            message: `${crypto.charAt(0).toUpperCase() + crypto.slice(1)} has ${priceChange} by ${changePercent}% in the last hour.`,
            timestamp: new Date().toISOString(),
            read: false,
          }

          dispatch(addNotification(notification))
        }
      }, 5000) // Update every 5 seconds
    }

    // Set up weather alert simulation
    const setupWeatherAlerts = () => {
      const weatherAlertInterval = setInterval(() => {
        if (Math.random() < 0.2) {
          // 20% chance to show a weather alert
          const cities = ["New York", "London", "Tokyo"]
          const alertTypes = ["Heavy Rain", "Extreme Heat", "Strong Winds", "Thunderstorm"]

          const city = cities[Math.floor(Math.random() * cities.length)]
          const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

          const notification = {
            id: `weather-${city}-${Date.now()}`,
            type: "weather_alert",
            title: `Weather Alert: ${city}`,
            message: `${alertType} warning for ${city}. Take necessary precautions.`,
            timestamp: new Date().toISOString(),
            read: false,
          }

          dispatch(addNotification(notification))

          toast({
            title: notification.title,
            description: notification.message,
          })
        }
      }, 30000) // Check every 30 seconds

      return weatherAlertInterval
    }

    // Initial setup
    setupWebSocket()
    const weatherInterval = setupWeatherAlerts()

    // Clean up
    return () => {
      if (ws) {
        ws.close()
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (mockDataInterval) {
        clearInterval(mockDataInterval)
      }
      if (weatherInterval) {
        clearInterval(weatherInterval)
      }
    }
  }, [dispatch, toast, connectionAttempts])

  return <>{children}</>
}

