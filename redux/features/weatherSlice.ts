import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Types
interface WeatherData {
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  pressure: number
  humidity: number
  windSpeed: number
  main: string
  description: string
}

interface City {
  id: string
  name: string
  country: string
  weather: WeatherData
}

interface WeatherState {
  cities: City[]
  favorites: string[]
  loading: "idle" | "pending" | "succeeded" | "failed"
  error: string | null
}

// Initial state
const initialState: WeatherState = {
  cities: [],
  favorites: [],
  loading: "idle",
  error: null,
}

// Mock API call to fetch weather data
export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async () => {
  try {
    // In a real app, this would be an API call to OpenWeatherMap
    // For this demo, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    return [
      {
        id: "new-york",
        name: "New York",
        country: "US",
        weather: {
          temp: 22,
          feelsLike: 23,
          tempMin: 20,
          tempMax: 25,
          pressure: 1012,
          humidity: 65,
          windSpeed: 5.2,
          main: "Clear",
          description: "Clear sky",
        },
      },
      {
        id: "london",
        name: "London",
        country: "UK",
        weather: {
          temp: 18,
          feelsLike: 17,
          tempMin: 16,
          tempMax: 20,
          pressure: 1008,
          humidity: 78,
          windSpeed: 4.1,
          main: "Clouds",
          description: "Scattered clouds",
        },
      },
      {
        id: "tokyo",
        name: "Tokyo",
        country: "JP",
        weather: {
          temp: 26,
          feelsLike: 28,
          tempMin: 24,
          tempMax: 29,
          pressure: 1015,
          humidity: 70,
          windSpeed: 3.5,
          main: "Rain",
          description: "Light rain",
        },
      },
      {
        id: "sydney",
        name: "Sydney",
        country: "AU",
        weather: {
          temp: 24,
          feelsLike: 25,
          tempMin: 22,
          tempMax: 27,
          pressure: 1010,
          humidity: 60,
          windSpeed: 6.2,
          main: "Clear",
          description: "Clear sky",
        },
      },
      {
        id: "paris",
        name: "Paris",
        country: "FR",
        weather: {
          temp: 20,
          feelsLike: 19,
          tempMin: 18,
          tempMax: 22,
          pressure: 1009,
          humidity: 72,
          windSpeed: 3.8,
          main: "Clouds",
          description: "Broken clouds",
        },
      },
      {
        id: "dubai",
        name: "Dubai",
        country: "AE",
        weather: {
          temp: 36,
          feelsLike: 40,
          tempMin: 34,
          tempMax: 38,
          pressure: 1005,
          humidity: 45,
          windSpeed: 5.5,
          main: "Clear",
          description: "Clear sky",
        },
      },
    ]
  } catch (error) {
    throw new Error("Failed to fetch weather data")
  }
})

// Weather slice
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const cityId = action.payload
      if (state.favorites.includes(cityId)) {
        state.favorites = state.favorites.filter((id) => id !== cityId)
      } else {
        state.favorites.push(cityId)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = "pending"
        state.error = null
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = "succeeded"
        state.cities = action.payload
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = "failed"
        state.error = action.error.message || "Failed to fetch weather data"
      })
  },
})

export const { toggleFavoriteCity } = weatherSlice.actions
export default weatherSlice.reducer

