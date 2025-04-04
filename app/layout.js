import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { WeatherSection } from "@/components/dashboard/weather-section"
import { CryptoSection } from "@/components/dashboard/crypto-section"
import { NewsSection } from "@/components/dashboard/news-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">CryptoWeather Nexus</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeatherSection />
          <CryptoSection />
          <NewsSection />
        </div>
      </div>
    </main>
  )
}

