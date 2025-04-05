"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { initializeFavorites } from "@/redux/features/favoritesSlice"

// This component doesn't render anything visible
// It just initializes favorites from localStorage when the app loads
export function FavoritesManager() {
  const dispatch = useDispatch()

  // Load favorites from localStorage on initial render
  useEffect(() => {
    dispatch(initializeFavorites())

    // For debugging
    console.log("FavoritesManager: Initialized favorites from localStorage")
  }, [dispatch])

  return null
}

