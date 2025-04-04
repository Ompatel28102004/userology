"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Card } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CryptoChartProps {
  cryptoId: string
}

export function CryptoChart({ cryptoId }: CryptoChartProps) {
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d" | "90d">("7d")

  const crypto = useSelector((state: RootState) => state.crypto.cryptos.find((c) => c.id === cryptoId))

  // Generate mock historical data for the chart
  const generateHistoricalData = () => {
    if (!crypto) return []

    const currentPrice = crypto.price
    const data = []

    let days = 1
    switch (timeRange) {
      case "7d":
        days = 7
        break
      case "30d":
        days = 30
        break
      case "90d":
        days = 90
        break
      default:
        days = 1
    }

    // Generate data points
    const points = days === 1 ? 24 : days // Hourly for 1d, daily for others

    for (let i = points; i >= 0; i--) {
      const date = new Date()

      if (days === 1) {
        date.setHours(date.getHours() - i)
      } else {
        date.setDate(date.getDate() - i)
      }

      // Add some random variation to the price
      // More variation for longer time periods
      const volatility = days === 1 ? 0.02 : days === 7 ? 0.05 : days === 30 ? 0.1 : 0.15
      const randomFactor = 1 + (Math.random() * volatility * 2 - volatility)

      // Create a trend based on current price change
      const trendFactor =
        crypto.priceChange24h >= 0
          ? 1 + (i / points) * (crypto.priceChange24h / 100)
          : 1 - (i / points) * (Math.abs(crypto.priceChange24h) / 100)

      const price = currentPrice * randomFactor * trendFactor

      data.push({
        date:
          days === 1 ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : date.toLocaleDateString(),
        price: price,
      })
    }

    return data
  }

  const data = generateHistoricalData()

  if (!crypto) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </Card>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div>
      <div className="flex justify-end mb-4 space-x-2">
        <Button variant={timeRange === "1d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("1d")}>
          1D
        </Button>
        <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
          7D
        </Button>
        <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
          30D
        </Button>
        <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
          90D
        </Button>
      </div>

      <ChartContainer className="h-[300px]">
        <Chart>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={(value, index) => {
                  // Show fewer ticks for better readability
                  return index % (timeRange === "1d" ? 4 : timeRange === "7d" ? 1 : timeRange === "30d" ? 5 : 15) === 0
                    ? value
                    : ""
                }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={(value) => formatPrice(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </ChartContainer>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-sm font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(payload[0].value)}
          </div>
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }

  return null
}

