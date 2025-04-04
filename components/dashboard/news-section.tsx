"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchNewsData } from "@/redux/features/newsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export function NewsSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { articles, loading, error } = useSelector((state: RootState) => state.news)

  useEffect(() => {
    dispatch(fetchNewsData())

    // Set up periodic refresh
    const interval = setInterval(() => {
      dispatch(fetchNewsData())
    }, 300000) // Refresh every 5 minutes

    return () => clearInterval(interval)
  }, [dispatch])

  if (loading === "failed") {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Crypto News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading news data: {error}</div>
          <Button variant="outline" className="mt-4" onClick={() => dispatch(fetchNewsData())}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Crypto News</CardTitle>
        <Link href="/news">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading === "pending" ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mb-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {articles.slice(0, 5).map((article) => (
              <div key={article.id} className="mb-4">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline block"
                >
                  {article.title}
                </a>
                <div className="text-sm text-muted-foreground mt-1">
                  {article.source} • {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

