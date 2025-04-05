"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/redux/store"
import type { AppDispatch } from "@/redux/store"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { FavoriteButton } from "./favorite-button"

export function FavoritesList() {
  const dispatch = useDispatch<AppDispatch>()
  const [activeTab, setActiveTab] = useState<"all" | "crypto" | "weather">("all")

  const { cities, loading: weatherLoading } = useAppSelector((state) => state.weather)
  const { cryptos, loading: cryptoLoading } = useAppSelector((state) => state.crypto)
  const favorites = useAppSelector((state) => state.favorites.items)

  useEffect(() => {
    // For debugging
    console.log("FavoritesList: Current favorites from Redux:", favorites)
  }, [favorites])

  const favoriteCryptos = favorites
    .filter((fav) => fav.type === "crypto")
    .map((fav) => {
      const cryptoData = cryptos.find((crypto) => crypto.id === fav.id)
      return { ...fav, data: cryptoData }
    })

  const favoriteWeather = favorites
    .filter((fav) => fav.type === "weather")
    .map((fav) => {
      const cityData = cities.find((city) => city.id === fav.id)
      return { ...fav, data: cityData }
    })

  useEffect(() => {
    dispatch(fetchWeatherData())
    dispatch(fetchCryptoData())
  }, [dispatch])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const renderEmptyState = () => (
    <Card className="col-span-full">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center py-10">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your favorite cryptocurrencies and weather locations to see them here.
          </p>
          <div className="flex gap-4">
            <Link href="/crypto">
              <Button>Browse Cryptocurrencies</Button>
            </Link>
            <Link href="/weather">
              <Button variant="outline">Browse Weather</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All Favorites</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {favorites.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="space-y-8">
              {favoriteWeather.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Weather Locations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weatherLoading === "pending"
                      ? Array(favoriteWeather.length)
                          .fill(0)
                          .map((_, i) => <WeatherSkeleton key={i} />)
                      : favoriteWeather.map((favorite) => <WeatherCard key={favorite.id} favorite={favorite} />)}
                  </div>
                </div>
              )}

              {favoriteCryptos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Cryptocurrencies</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cryptoLoading === "pending"
                      ? Array(favoriteCryptos.length)
                          .fill(0)
                          .map((_, i) => <CryptoSkeleton key={i} />)
                      : favoriteCryptos.map((favorite) => <CryptoCard key={favorite.id} favorite={favorite} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="crypto">
          {favoriteCryptos.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't added any cryptocurrencies to your favorites yet.
                </p>
                <Link href="/crypto">
                  <Button>Browse Cryptocurrencies</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cryptoLoading === "pending"
                ? Array(favoriteCryptos.length)
                    .fill(0)
                    .map((_, i) => <CryptoSkeleton key={i} />)
                : favoriteCryptos.map((favorite) => <CryptoCard key={favorite.id} favorite={favorite} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="weather">
          {favoriteWeather.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't added any weather locations to your favorites yet.
                </p>
                <Link href="/weather">
                  <Button>Browse Weather Locations</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherLoading === "pending"
                ? Array(favoriteWeather.length)
                    .fill(0)
                    .map((_, i) => <WeatherSkeleton key={i} />)
                : favoriteWeather.map((favorite) => <WeatherCard key={favorite.id} favorite={favorite} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WeatherCard({ favorite }: { favorite: any }) {
  if (!favorite.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{favorite.name}</h3>
              <p className="text-sm text-muted-foreground">Data unavailable</p>
            </div>
            <FavoriteButton id={favorite.id} type="weather" name={favorite.name} showText={false} />
          </div>
          <div className="text-sm text-muted-foreground flex items-center mt-4">
            <Clock className="h-3 w-3 mr-1" />
            Added {formatDistanceToNow(new Date(favorite.timestamp), { addSuffix: true })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Link href={`/weather/${favorite.id}`}>
            <h3 className="text-xl font-bold hover:underline">{favorite.data.name}</h3>
          </Link>
          <FavoriteButton id={favorite.id} type="weather" name={favorite.name} showText={false} />
        </div>
        <div className="text-3xl font-bold mb-2">{favorite.data.weather.temp}°C</div>
        <div className="text-muted-foreground mb-4">
          {favorite.data.weather.main}, Humidity: {favorite.data.weather.humidity}%
        </div>
        <div className="text-sm text-muted-foreground flex items-center mt-4">
          <Clock className="h-3 w-3 mr-1" />
          Added {formatDistanceToNow(new Date(favorite.timestamp), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  )
}

function CryptoCard({ favorite }: { favorite: any }) {
  if (!favorite.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{favorite.name}</h3>
              <p className="text-sm text-muted-foreground">Data unavailable</p>
            </div>
            <FavoriteButton id={favorite.id} type="crypto" name={favorite.name} showText={false} />
          </div>
          <div className="text-sm text-muted-foreground flex items-center mt-4">
            <Clock className="h-3 w-3 mr-1" />
            Added {formatDistanceToNow(new Date(favorite.timestamp), { addSuffix: true })}
          </div>
        </CardContent>
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
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Link href={`/crypto/${favorite.id}`}>
            <h3 className="text-xl font-bold hover:underline">
              {favorite.data.name} <span className="text-muted-foreground">({favorite.data.symbol.toUpperCase()})</span>
            </h3>
          </Link>
          <FavoriteButton id={favorite.id} type="crypto" name={favorite.name} showText={false} />
        </div>
        <div className="text-3xl font-bold mb-2">{formatPrice(favorite.data.price)}</div>
        <div className={`flex items-center ${favorite.data.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
          {favorite.data.priceChange24h >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {favorite.data.priceChange24h.toFixed(2)}% (24h)
        </div>
        <div className="text-sm text-muted-foreground flex items-center mt-4">
          <Clock className="h-3 w-3 mr-1" />
          Added {formatDistanceToNow(new Date(favorite.timestamp), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  )
}

function WeatherSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-10 w-20 mb-2" />
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-4 w-32 mt-4" />
      </CardContent>
    </Card>
  )
}

function CryptoSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-10 w-24 mb-2" />
        <Skeleton className="h-4 w-20 mb-4" />
        <Skeleton className="h-4 w-32 mt-4" />
      </CardContent>
    </Card>
  )
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

