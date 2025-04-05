"use client"

import { Button } from "@/components/ui/button"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { type AppDispatch, useAppSelector } from "@/redux/store"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Thermometer, Wind } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { FavoriteButton } from "@/components/favorites/favorite-button"

export function WeatherList() {
  const dispatch = useDispatch<AppDispatch>()
  const { cities, loading, error } = useAppSelector((state) => state.weather)

  useEffect(() => {
    dispatch(fetchWeatherData())
  }, [dispatch])

  if (loading === "failed") {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error loading weather data: {error}</div>
        <Button variant="outline" onClick={() => dispatch(fetchWeatherData())}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading === "pending"
        ? Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    <Skeleton className="h-16 w-24 mb-4" />
                    <div className="grid grid-cols-3 gap-2">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        : cities.map((city) => (
            <Card key={city.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Link href={`/weather/${city.id}`}>
                      <h3 className="text-2xl font-bold hover:underline">{city.name}</h3>
                    </Link>
                    <FavoriteButton id={city.id} type="weather" name={city.name} showText={false} />
                  </div>
                  <div className="text-4xl font-bold mb-6">{city.weather.temp}°C</div>
                  <div className="text-lg mb-4">{city.weather.main}</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <Thermometer className="h-5 w-5 mb-1" />
                      <span>Feels like</span>
                      <span className="font-medium">{city.weather.feelsLike}°C</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <Droplets className="h-5 w-5 mb-1" />
                      <span>Humidity</span>
                      <span className="font-medium">{city.weather.humidity}%</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <Wind className="h-5 w-5 mb-1" />
                      <span>Wind</span>
                      <span className="font-medium">{city.weather.windSpeed} m/s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}

