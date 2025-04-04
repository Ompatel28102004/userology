"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchCryptoData, toggleFavoriteCrypto } from "@/redux/features/cryptoSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, TrendingDown, TrendingUp, DollarSign, BarChart3, Activity } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { CryptoChart } from "@/components/crypto/crypto-chart"

interface CryptoDetailProps {
  cryptoId: string
}

export function CryptoDetail({ cryptoId }: CryptoDetailProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { cryptos, loading, error } = useSelector((state: RootState) => state.crypto)
  const favoriteCryptos = useSelector((state: RootState) => state.crypto.favorites)

  const crypto = cryptos.find((c) => c.id === cryptoId)

  useEffect(() => {
    if (!crypto) {
      dispatch(fetchCryptoData())
    }
  }, [dispatch, crypto, cryptoId])

  const handleToggleFavorite = () => {
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
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error loading crypto data: {error}</div>
        <Button variant="outline" onClick={() => dispatch(fetchCryptoData())}>
          Retry
        </Button>
      </div>
    )
  }

  if (loading === "pending" || !crypto) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Link href="/crypto">
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
          <Link href="/crypto">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {crypto.name} <span className="text-muted-foreground">({crypto.symbol.toUpperCase()})</span>
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleToggleFavorite} className="flex items-center gap-2">
          <Star className={`h-4 w-4 ${favoriteCryptos.includes(cryptoId) ? "fill-yellow-400 text-yellow-400" : ""}`} />
          {favoriteCryptos.includes(cryptoId) ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-end mb-4">
                <div className="text-5xl font-bold mr-4">{formatPrice(crypto.price)}</div>
                <div
                  className={`text-xl flex items-center ${
                    crypto.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {crypto.priceChange24h >= 0 ? (
                    <TrendingUp className="h-5 w-5 mr-1" />
                  ) : (
                    <TrendingDown className="h-5 w-5 mr-1" />
                  )}
                  {crypto.priceChange24h.toFixed(2)}%
                </div>
              </div>
              <div className="text-muted-foreground mb-6">
                24h Change: {formatPrice(crypto.price * (1 - crypto.priceChange24h / 100))} →{" "}
                {formatPrice(crypto.price)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <DollarSign className="h-5 w-5 mb-2 text-green-500" />
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-medium">{formatMarketCap(crypto.marketCap)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <BarChart3 className="h-5 w-5 mb-2 text-green-500" />
                    <div className="text-sm text-muted-foreground">Volume (24h)</div>
                    <div className="font-medium">{formatMarketCap(crypto.volume24h)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Activity className="h-5 w-5 mb-2 text-green-500" />
                    <div className="text-sm text-muted-foreground">Circulating Supply</div>
                    <div className="font-medium">
                      {new Intl.NumberFormat("en-US").format(crypto.circulatingSupply)} {crypto.symbol.toUpperCase()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <TrendingUp className="h-5 w-5 mb-2 text-green-500" />
                    <div className="text-sm text-muted-foreground">All-Time High</div>
                    <div className="font-medium">{formatPrice(crypto.allTimeHigh)}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <CryptoChart cryptoId={cryptoId} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

