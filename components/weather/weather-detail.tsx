"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { type AppDispatch, useAppSelector } from "@/redux/store"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Droplets, Thermometer, Wind, Sun } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { WeatherChart } from "@/components/weather/weather-chart"
import { FavoriteButton } from "@/components/favorites/favorite-button"

interface WeatherDetailProps {
  cityId: string
}

export function WeatherDetail({ cityId }: WeatherDetailProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { cities, loading, error } = useAppSelector((state) => state.weather)

  const city = cities.find((c) => c.id === cityId)

  useEffect(() => {
    if (!city) {
      dispatch(fetchWeatherData())
    }
  }, [dispatch, city, cityId])

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

  if (loading === "pending" || !city) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Link href="/weather">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Skeleton className="h-8 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-16 w-32 mb-4" />
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-[300px] w-full rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/weather">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{city.name}</h1>
        </div>
        <FavoriteButton id={cityId} type="weather" name={city.name} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-end mb-4">
                <div className="text-5xl font-bold mr-4">{city.weather.temp}°C</div>
                <div className="text-xl">{city.weather.main}</div>
              </div>
              <div className="text-muted-foreground mb-6">
                Feels like {city.weather.feelsLike}°C. {city.weather.description}.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Thermometer className="h-5 w-5 mb-2 text-blue-500" />
                    <div className="text-sm text-muted-foreground">Min/Max</div>
                    <div className="font-medium">
                      {city.weather.tempMin}°C / {city.weather.tempMax}°C
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Droplets className="h-5 w-5 mb-2 text-blue-500" />
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-medium">{city.weather.humidity}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Wind className="h-5 w-5 mb-2 text-blue-500" />
                    <div className="text-sm text-muted-foreground">Wind</div>
                    <div className="font-medium">{city.weather.windSpeed} m/s</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Sun className="h-5 w-5 mb-2 text-yellow-500" />
                    <div className="text-sm text-muted-foreground">Pressure</div>
                    <div className="font-medium">{city.weather.pressure} hPa</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <WeatherChart cityId={cityId} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

