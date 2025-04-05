"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { type AppDispatch, useAppSelector } from "@/redux/store"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { FavoriteButton } from "@/components/favorites/favorite-button"

export function CryptoList() {
  const dispatch = useDispatch<AppDispatch>()
  const { cryptos, loading, error } = useAppSelector((state) => state.crypto)

  useEffect(() => {
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
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error loading crypto data: {error}</div>
        <Button variant="outline" onClick={() => dispatch(fetchCryptoData())}>
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
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        : cryptos.map((crypto) => (
            <Card key={crypto.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Link href={`/crypto/${crypto.id}`}>
                      <h3 className="text-2xl font-bold hover:underline">
                        {crypto.name} <span className="text-muted-foreground">({crypto.symbol.toUpperCase()})</span>
                      </h3>
                    </Link>
                    <FavoriteButton id={crypto.id} type="crypto" name={crypto.name} showText={false} />
                  </div>
                  <div className="text-4xl font-bold mb-6">{formatPrice(crypto.price)}</div>
                  <div
                    className={`text-lg mb-4 flex items-center ${
                      crypto.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {crypto.priceChange24h >= 0 ? (
                      <TrendingUp className="h-5 w-5 mr-2" />
                    ) : (
                      <TrendingDown className="h-5 w-5 mr-2" />
                    )}
                    {crypto.priceChange24h.toFixed(2)}% (24h)
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col p-2 bg-muted rounded-md">
                      <span className="text-muted-foreground">Market Cap</span>
                      <span className="font-medium">{formatMarketCap(crypto.marketCap)}</span>
                    </div>
                    <div className="flex flex-col p-2 bg-muted rounded-md">
                      <span className="text-muted-foreground">Volume (24h)</span>
                      <span className="font-medium">{formatMarketCap(crypto.volume24h)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}

