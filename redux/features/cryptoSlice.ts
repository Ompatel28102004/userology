import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Types
interface Crypto {
  id: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  allTimeHigh: number
}

interface CryptoState {
  cryptos: Crypto[]
  favorites: string[]
  loading: "idle" | "pending" | "succeeded" | "failed"
  error: string | null
}

// Initial state
const initialState: CryptoState = {
  cryptos: [],
  favorites: [],
  loading: "idle",
  error: null,
}

// Mock API call to fetch crypto data
export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async () => {
  try {
    // In a real app, this would be an API call to CoinGecko or similar
    // For this demo, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    return [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        price: 50000 + Math.random() * 2000,
        priceChange24h: 2.5,
        marketCap: 950000000000,
        volume24h: 30000000000,
        circulatingSupply: 19000000,
        allTimeHigh: 69000,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "eth",
        price: 3000 + Math.random() * 200,
        priceChange24h: -1.2,
        marketCap: 350000000000,
        volume24h: 15000000000,
        circulatingSupply: 120000000,
        allTimeHigh: 4800,
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "sol",
        price: 100 + Math.random() * 10,
        priceChange24h: 5.8,
        marketCap: 40000000000,
        volume24h: 2000000000,
        circulatingSupply: 400000000,
        allTimeHigh: 260,
      },
      {
        id: "cardano",
        name: "Cardano",
        symbol: "ada",
        price: 0.5 + Math.random() * 0.05,
        priceChange24h: -0.7,
        marketCap: 18000000000,
        volume24h: 500000000,
        circulatingSupply: 35000000000,
        allTimeHigh: 3.1,
      },
      {
        id: "polkadot",
        name: "Polkadot",
        symbol: "dot",
        price: 7 + Math.random() * 0.5,
        priceChange24h: 1.3,
        marketCap: 9000000000,
        volume24h: 300000000,
        circulatingSupply: 1200000000,
        allTimeHigh: 55,
      },
      {
        id: "ripple",
        name: "XRP",
        symbol: "xrp",
        price: 0.6 + Math.random() * 0.05,
        priceChange24h: 3.2,
        marketCap: 32000000000,
        volume24h: 1500000000,
        circulatingSupply: 50000000000,
        allTimeHigh: 3.4,
      },
    ]
  } catch (error) {
    throw new Error("Failed to fetch crypto data")
  }
})

// Crypto slice
const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    toggleFavoriteCrypto: (state, action: PayloadAction<string>) => {
      const cryptoId = action.payload
      if (state.favorites.includes(cryptoId)) {
        state.favorites = state.favorites.filter((id) => id !== cryptoId)
      } else {
        state.favorites.push(cryptoId)
      }
    },
    updateCryptoPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const { id, price } = action.payload
      const crypto = state.cryptos.find((c) => c.id === id)
      if (crypto) {
        const oldPrice = crypto.price
        crypto.price = price
        // Calculate new 24h change based on the price update
        // In a real app, this would be more complex
        const priceChangePct = ((price - oldPrice) / oldPrice) * 100
        crypto.priceChange24h = Math.max(-15, Math.min(15, crypto.priceChange24h + priceChangePct * 0.1))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = "pending"
        state.error = null
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = "succeeded"
        state.cryptos = action.payload
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = "failed"
        state.error = action.error.message || "Failed to fetch crypto data"
      })
  },
})

export const { toggleFavoriteCrypto, updateCryptoPrice } = cryptoSlice.actions
export default cryptoSlice.reducer

