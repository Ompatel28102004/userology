"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Card } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WeatherChartProps {
  cityId: string
}

export function WeatherChart({ cityId }: WeatherChartProps) {
  const city = useSelector((state: RootState) => state.weather.cities.find((c) => c.id === cityId))

  // Generate mock historical data for the chart
  const generateHistoricalData = () => {
    if (!city) return []

    const currentTemp = city.weather.temp
    const data = []

    // Generate data for the last 24 hours with some variation
    for (let i = 24; i >= 0; i--) {
      const hourAgo = new Date()
      hourAgo.setHours(hourAgo.getHours() - i)

      // Add some random variation to the temperature
      const variation = Math.random() * 6 - 3 // -3 to +3 degrees
      const temp = Math.round((currentTemp + variation) * 10) / 10

      data.push({
        time: hourAgo.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temperature: temp,
        hour: hourAgo.getHours(),
      })
    }

    return data
  }

  const data = generateHistoricalData()

  if (!city) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </Card>
    )
  }

  return (
    <ChartContainer className="h-[300px]">
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value, index) => {
                // Show fewer ticks for better readability
                return index % 4 === 0 ? value : ""
              }}
            />
            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value) => `${value}°C`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="temperature" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-sm font-bold">{payload[0].value}°C</div>
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }

  return null
}

