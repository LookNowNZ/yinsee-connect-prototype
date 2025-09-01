"use client"

import { getProvider } from "@/utils/provider-store"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useActivityLog } from "@/hooks/use-activity-log"
import { useEffect, useState } from "react"

interface Request {
  id: string
  category: string
  description: string
  suburb: string
  status: "OPEN" | "MATCHED"
  createdAt: string
}

export default function StatsPage() {
  const [providerBalance, setProviderBalance] = useState(0)
  const [requests] = useLocalStorage<Request[]>("yinsee_requests", [])
  const [testerReports, setTesterReports] = useState(0)
  const { activities } = useActivityLog()

  useEffect(() => {
    const updateBalance = () => {
      const provider = getProvider()
      setProviderBalance(provider?.walletCredits || 0)
    }

    const updateTesterReports = () => {
      const reports = localStorage.getItem("testerReports")
      setTesterReports(reports ? JSON.parse(reports).length : 0)
    }

    updateBalance()
    updateTesterReports()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "yinsee_provider") {
        updateBalance()
      }
      if (e.key === "testerReports") {
        updateTesterReports()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const openRequests = requests.filter((req) => req.status === "OPEN").length
  const matchedRequests = requests.filter((req) => req.status === "MATCHED").length
  const totalConnections = activities.filter((entry) => entry.type === "connected").length

  const stats = [
    { label: "Total Available requests", value: openRequests },
    { label: "Total Connected requests", value: matchedRequests },
    { label: "Provider balance", value: `${providerBalance} credits` },
    { label: "Total connections", value: totalConnections },
    { label: "Tester reports", value: testerReports },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-title font-bold text-center mb-8">Stats (Preview)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card p-6 rounded-2xl border">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
