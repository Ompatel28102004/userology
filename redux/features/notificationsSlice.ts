import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Types
interface Notification {
  id: string
  type: "price_alert" | "weather_alert"
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationsState {
  items: Notification[]
}

// Initial state
const initialState: NotificationsState = {
  items: [],
}

// Notifications slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload)
      // Keep only the last 20 notifications
      if (state.items.length > 20) {
        state.items = state.items.slice(0, 20)
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true
      })
    },
    clearNotifications: (state) => {
      state.items = []
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationsSlice.actions
export default notificationsSlice.reducer

