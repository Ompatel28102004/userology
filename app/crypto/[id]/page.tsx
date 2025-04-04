import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CryptoDetail } from "@/components/crypto/crypto-detail"

interface CryptoDetailPageProps {
  params: {
    id: string
  }
}

export default function CryptoDetailPage({ params }: CryptoDetailPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <CryptoDetail cryptoId={params.id} />
      </div>
    </main>
  )
}

