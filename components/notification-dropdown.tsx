"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { markAsRead } from "@/redux/features/notificationsSlice"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface NotificationDropdownProps {
  onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications.items)

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  return (
    <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto z-50 p-2">
      <div className="flex justify-between items-center mb-2 p-2">
        <h3 className="font-medium">Notifications</h3>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No notifications</div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-md text-sm ${notification.read ? "bg-muted/50" : "bg-muted"}`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-1">{notification.message}</p>
              {!notification.read && (
                <div className="mt-2 text-right">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">New</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

