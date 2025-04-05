import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch } from "../store"

// Types
export interface FavoriteItem {
  id: string
  type: "crypto" | "weather"
  name: string
  timestamp: string
}

interface FavoritesState {
  items: FavoriteItem[]
}

// Helper function to load favorites from localStorage
const loadFavoritesFromStorage = (): FavoriteItem[] => {
  if (typeof window === "undefined") return []

  try {
    const storedFavorites = localStorage.getItem("favorites")
    return storedFavorites ? JSON.parse(storedFavorites) : []
  } catch (error) {
    console.error("Failed to load favorites from localStorage:", error)
    return []
  }
}

// Initial state
const initialState: FavoritesState = {
  items: [],
}

// Favorites slice
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    initializeFavorites: (state) => {
      // This action is dispatched when the app loads
      state.items = loadFavoritesFromStorage()
    },
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      // Check if item already exists
      const exists = state.items.some((item) => item.id === action.payload.id && item.type === action.payload.type)

      if (!exists) {
        state.items.push(action.payload)
        // Save to localStorage directly
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("favorites", JSON.stringify(state.items))
          } catch (error) {
            console.error("Failed to save favorites to localStorage:", error)
          }
        }
      }
    },
    removeFavorite: (state, action: PayloadAction<{ id: string; type: "crypto" | "weather" }>) => {
      state.items = state.items.filter((item) => !(item.id === action.payload.id && item.type === action.payload.type))

      // Save to localStorage directly
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("favorites", JSON.stringify(state.items))
        } catch (error) {
          console.error("Failed to save favorites to localStorage:", error)
        }
      }
    },
  },
})

// Action to toggle a favorite
export const toggleFavorite = (item: FavoriteItem) => (dispatch: AppDispatch, getState: any) => {
  const { favorites } = getState()
  const exists = favorites.items.some((fav: FavoriteItem) => fav.id === item.id && fav.type === item.type)

  if (exists) {
    dispatch(removeFavorite({ id: item.id, type: item.type }))
  } else {
    dispatch(addFavorite(item))
  }
}

export const { initializeFavorites, addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer

