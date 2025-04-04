"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchWeatherData, toggleFavoriteCity } from "@/redux/features/weatherSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function WeatherSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { cities, loading, error } = useSelector((state: RootState) => state.weather)
  const favoriteCities = useSelector((state: RootState) => state.weather.favorites)

  useEffect(() => {
    dispatch(fetchWeatherData())

    // Set up periodic refresh
    const interval = setInterval(() => {
      dispatch(fetchWeatherData())
    }, 60000) // Refresh every 60 seconds

    return () => clearInterval(interval)
  }, [dispatch])

  const handleToggleFavorite = (cityId: string) => {
    dispatch(toggleFavoriteCity(cityId))
  }

  if (loading === "failed") {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading weather data: {error}</div>
          <Button variant="outline" className="mt-4" onClick={() => dispatch(fetchWeatherData())}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather</CardTitle>
        <Link href="/weather">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading === "pending" ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {cities.map((city) => (
              <div key={city.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/weather/${city.id}`} className="font-medium hover:underline">
                      {city.name}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleToggleFavorite(city.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          favoriteCities.includes(city.id) ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {city.weather.main}, {city.weather.temp}°C
                  </div>
                </div>
                <div className="text-2xl font-bold">{city.weather.temp}°C</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

