"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function FavoritesList() {
  const dispatch = useDispatch<AppDispatch>()

  const { cities, loading: weatherLoading } = useSelector((state: RootState) => state.weather)
  const favoriteCities = useSelector((state: RootState) => state.weather.favorites)
  const favoriteCitiesData = cities.filter((city) => favoriteCities.includes(city.id))

  const { cryptos, loading: cryptoLoading } = useSelector((state: RootState) => state.crypto)
  const favoriteCryptos = useSelector((state: RootState) => state.crypto.favorites)
  const favoriteCryptosData = cryptos.filter((crypto) => favoriteCryptos.includes(crypto.id))

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

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Favorite Cities</h2>
        {weatherLoading === "pending" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favoriteCitiesData.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't added any cities to your favorites yet.</p>
              <Link href="/weather">
                <Button>Browse Cities</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCitiesData.map((city) => (
              <Card key={city.id}>
                <CardContent className="p-6">
                  <Link href={`/weather/${city.id}`}>
                    <h3 className="text-xl font-bold hover:underline mb-2">{city.name}</h3>
                  </Link>
                  <div className="text-3xl font-bold mb-2">{city.weather.temp}°C</div>
                  <div className="text-muted-foreground">
                    {city.weather.main}, Humidity: {city.weather.humidity}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Favorite Cryptocurrencies</h2>
        {cryptoLoading === "pending" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favoriteCryptosData.length === 0 ? (
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
            {favoriteCryptosData.map((crypto) => (
              <Card key={crypto.id}>
                <CardContent className="p-6">
                  <Link href={`/crypto/${crypto.id}`}>
                    <h3 className="text-xl font-bold hover:underline mb-2">
                      {crypto.name} <span className="text-muted-foreground">({crypto.symbol.toUpperCase()})</span>
                    </h3>
                  </Link>
                  <div className="text-3xl font-bold mb-2">{formatPrice(crypto.price)}</div>
                  <div
                    className={`flex items-center ${crypto.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {crypto.priceChange24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {crypto.priceChange24h.toFixed(2)}% (24h)
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

