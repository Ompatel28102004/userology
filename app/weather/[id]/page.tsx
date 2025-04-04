import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WeatherDetail } from "@/components/weather/weather-detail"

interface WeatherDetailPageProps {
  params: {
    id: string
  }
}

export default function WeatherDetailPage({ params }: WeatherDetailPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <WeatherDetail cityId={params.id} />
      </div>
    </main>
  )
}

