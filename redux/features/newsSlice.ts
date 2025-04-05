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

// API configuration
// const RAPID_API_KEY = '4ec154cc17mshfb1a17a88a74772p159e36jsn6467a42c7d46';
const RAPID_API_HOST = 'cryptocurrency-news2.p.rapidapi.com';

export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async () => {
  // Try different endpoint
  const url = 'https://cryptocurrency-news2.p.rapidapi.com/v1/cointelegraph';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': RAPID_API_HOST
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Check if data exists and has the expected structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid API response format');
    }

    // Handle different possible response structures
    const articles = Array.isArray(data.data) ? data.data : 
                    Array.isArray(data) ? data : [];

    // Map the data with more careful property access
    return articles.map((article: any, index: number) => ({
      id: String(index),
      title: typeof article.title === 'string' ? article.title : 'No title available',
      url: article.url || article.link || '#',
      source: 'CoinTelegraph',
      publishedAt: new Date().toISOString(),
    }));

  } catch (error) {
    console.error('Detailed fetch error:', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
});


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

