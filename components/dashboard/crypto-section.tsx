"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchCryptoData, toggleFavoriteCrypto } from "@/redux/features/cryptoSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function CryptoSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { cryptos, loading, error } = useSelector((state: RootState) => state.crypto)
  const favoriteCryptos = useSelector((state: RootState) => state.crypto.favorites)

  useEffect(() => {
    dispatch(fetchCryptoData())

    // Set up periodic refresh
    const interval = setInterval(() => {
      dispatch(fetchCryptoData())
    }, 60000) // Refresh every 60 seconds

    return () => clearInterval(interval)
  }, [dispatch])

  const handleToggleFavorite = (cryptoId: string) => {
    dispatch(toggleFavoriteCrypto(cryptoId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
      return `$${marketCap.toFixed(2)}`
    }
  }

  if (loading === "failed") {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Cryptocurrency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading crypto data: {error}</div>
          <Button variant="outline" className="mt-4" onClick={() => dispatch(fetchCryptoData())}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cryptocurrency</CardTitle>
        <Link href="/crypto">
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
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {cryptos.map((crypto) => (
              <div key={crypto.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/crypto/${crypto.id}`} className="font-medium hover:underline">
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleToggleFavorite(crypto.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          favoriteCryptos.includes(crypto.id) ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">Market Cap: {formatMarketCap(crypto.marketCap)}</div>
                </div>
                <div>
                  <div className="text-right font-bold">{formatPrice(crypto.price)}</div>
                  <div
                    className={`text-sm flex items-center justify-end ${
                      crypto.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {crypto.priceChange24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {crypto.priceChange24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

