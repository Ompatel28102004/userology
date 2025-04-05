import { configureStore } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useSelector } from "react-redux"
import weatherReducer from "./features/weatherSlice"
import cryptoReducer from "./features/cryptoSlice"
import newsReducer from "./features/newsSlice"
import notificationsReducer from "./features/notificationsSlice"
import favoritesReducer from "./features/favoritesSlice"

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    notifications: notificationsReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

