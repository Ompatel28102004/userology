"use client"

import { useDispatch } from "react-redux"
import { useAppSelector } from "@/redux/store"
import { toggleFavorite, type FavoriteItem } from "@/redux/features/favoritesSlice"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  id: string
  type: "crypto" | "weather"
  name: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  showText?: boolean
}

export function FavoriteButton({
  id,
  type,
  name,
  className,
  variant = "outline",
  size = "sm",
  showText = true,
}: FavoriteButtonProps) {
  const dispatch = useDispatch()
  const favorites = useAppSelector((state) => state.favorites.items)

  const isFavorite = favorites.some((item) => item.id === id && item.type === type)

  const handleToggleFavorite = () => {
    const item: FavoriteItem = {
      id,
      type,
      name,
      timestamp: new Date().toISOString(),
    }

    dispatch(toggleFavorite(item))

    // For debugging
    console.log(`FavoriteButton: Toggled favorite - ${type}:${id} - ${isFavorite ? "removed" : "added"}`)
  }

  return (
    <Button variant={variant} size={size} onClick={handleToggleFavorite} className={cn("group", className)}>
      <Star
        className={cn(
          "h-4 w-4 transition-all",
          isFavorite ? "fill-yellow-400 text-yellow-400" : "fill-none",
          "group-hover:scale-110",
        )}
      />
      {showText && <span className="ml-2">{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>}
    </Button>
  )
}

