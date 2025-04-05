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

const RAPID_API_KEY = '4ec154cc17mshfb1a17a88a74772p159e36jsn6467a42c7d46';
const RAPID_API_HOST = 'yahoo-weather5.p.rapidapi.com';

const cities = ['New York', 'London', 'Tokyo', 'Sydney', 'Paris', 'Dubai'];

export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async () => {
  try {
    const weatherPromises = cities.map(async (city) => {
      const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${encodeURIComponent(city)}&format=json&u=f`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPID_API_KEY,
          'x-rapidapi-host': RAPID_API_HOST
        }
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Weather API error for ${city}: ${response.status}`);
      }
      const data = await response.json();

      // Transform Yahoo Weather API data to match our interface
      return {
        id: city.toLowerCase().replace(' ', '-'),
        name: city,
        country: data.location.country,
        weather: {
          temp: ((data.current_observation.condition.temperature - 32) * 5/9).toFixed(1), // Convert F to C
          feelsLike: ((data.current_observation.wind.chill - 32) * 5/9).toFixed(1),
          tempMin: ((data.forecasts[0].low - 32) * 5/9).toFixed(1),
          tempMax: ((data.forecasts[0].high - 32) * 5/9).toFixed(1),
          pressure: data.current_observation.atmosphere.pressure,
          humidity: data.current_observation.atmosphere.humidity,
          windSpeed: (data.current_observation.wind.speed * 1.60934).toFixed(1), // Convert mph to kph
          main: data.current_observation.condition.text,
          description: data.current_observation.condition.text,
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

