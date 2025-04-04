import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CryptoList } from "@/components/crypto/crypto-list"

export default function CryptoPage() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Cryptocurrency Dashboard</h1>
        <CryptoList />
      </div>
    </main>
  )
}

