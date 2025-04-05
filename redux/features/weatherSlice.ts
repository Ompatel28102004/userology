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

const RAPID_API_KEY = '4bef3fa07emshee9d81ec33de101p137349jsne3c78ad159e9';
const RAPID_API_HOST = 'weatherapi-com.p.rapidapi.com';

const cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Paris', 'Dubai'];

export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async () => {
  try {
    const weatherPromises = cities.map(async (city) => {
      const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${encodeURIComponent(city)}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': RAPID_API_HOST,
          'Accept': 'application/json'
        }
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Weather API error for ${city}: ${response.status}`);
      }
      const data = await response.json();

      // Transform WeatherAPI.com data to match our interface
      return {
        id: city.toLowerCase().replace(' ', '-'),
        name: data.location.name,
        country: data.location.country,
        weather: {
          temp: data.current.temp_c,
          feelsLike: data.current.feelslike_c,
          tempMin: data.current.temp_c - 2, // approximation since current-only endpoint
          tempMax: data.current.temp_c + 2, // approximation since current-only endpoint
          pressure: data.current.pressure_mb,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
          main: data.current.condition.text,
          description: data.current.condition.text,
        },
      };
    });

    const results = await Promise.all(weatherPromises);
    return results;

  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error("Failed to fetch weather data");
  }
});

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

