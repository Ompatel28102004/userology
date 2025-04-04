import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Types
interface NewsArticle {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
}

interface NewsState {
  articles: NewsArticle[]
  loading: "idle" | "pending" | "succeeded" | "failed"
  error: string | null
}

// Initial state
const initialState: NewsState = {
  articles: [],
  loading: "idle",
  error: null,
}

// Mock API call to fetch news data
export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async () => {
  try {
    // In a real app, this would be an API call to NewsData.io or similar
    // For this demo, we'll return mock data
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    return [
      {
        id: "news-1",
        title: "Bitcoin Surges Past $50,000 as Institutional Adoption Grows",
        url: "#",
        source: "CryptoNews",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: "news-2",
        title: "Ethereum 2.0 Upgrade: What You Need to Know About the Merge",
        url: "#",
        source: "BlockchainInsider",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      },
      {
        id: "news-3",
        title: "Regulatory Clarity: New Crypto Framework Proposed by SEC",
        url: "#",
        source: "FinanceDaily",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      },
      {
        id: "news-4",
        title: "DeFi Market Cap Reaches New All-Time High of $150 Billion",
        url: "#",
        source: "DeFiPulse",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      },
      {
        id: "news-5",
        title: "NFT Sales Volume Drops 30% in Q2 2023, Analysis Shows",
        url: "#",
        source: "NFTWorld",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      },
      {
        id: "news-6",
        title: "Major Bank Launches Crypto Custody Service for Institutional Clients",
        url: "#",
        source: "BankingTech",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      },
      {
        id: "news-7",
        title: "Solana Ecosystem Growth Accelerates with New Developer Tools",
        url: "#",
        source: "CryptoDevs",
        publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
      },
      {
        id: "news-8",
        title: "Central Banks Worldwide Exploring CBDC Options, Survey Finds",
        url: "#",
        source: "GlobalFinance",
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
      },
    ]
  } catch (error) {
    throw new Error("Failed to fetch news data")
  }
})

// News slice
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = "pending"
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = "succeeded"
        state.articles = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = "failed"
        state.error = action.error.message || "Failed to fetch news data"
      })
  },
})

export default newsSlice.reducer

