import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FavoritesList } from "@/components/favorites/favorites-list"

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
        <FavoritesList />
      </div>
    </main>
  )
}