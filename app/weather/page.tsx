import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WeatherList } from "@/components/weather/weather-list"

export default function WeatherPage() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Weather Dashboard</h1>
        <WeatherList />
      </div>
    </main>
  )
}

