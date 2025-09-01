"use client"

import { TextButton } from "@/components/text-button"
import { useToast } from "@/hooks/use-toast"
import { useActivityLog } from "@/hooks/use-activity-log"
import { getProvider, setProvider, generateProviderId } from "@/utils/provider-store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function ProviderPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [provider, setProviderState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addActivity, getRecentActivities, formatActivity } = useActivityLog()

  useEffect(() => {
    const providerData = getProvider()
    setProviderState(providerData)
    setLoading(false)
  }, [])

  const getProviderFeedback = (providerId: string) => {
    const allFeedback = JSON.parse(localStorage.getItem("yinsee_feedback") || "[]")
    return allFeedback
      .filter((feedback: any) => feedback.providerId === providerId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2)
  }

  const recentFeedback = getProviderFeedback(provider?.id || "")
  const recentActivities = getRecentActivities(5)

  const handleTopUp = () => {
    if (provider) {
      const updatedProvider = {
        ...provider,
        walletCredits: provider.walletCredits + 5,
      }
      setProvider(updatedProvider)
      setProviderState(updatedProvider)
      addActivity({
        type: "topup",
        amount: 5,
      })
      toast({ description: "Balance updated" })
    }
  }

  const handleCreateProvider = () => {
    const newProvider = {
      id: generateProviderId(),
      walletCredits: 20,
      createdAt: new Date().toISOString(),
    }
    setProvider(newProvider)
    toast({ description: "Provider profile created" })
    router.push("/provider")
  }

  const handleCopy = () => {
    if (provider?.id) {
      navigator.clipboard.writeText(provider.id)
      toast({ description: "Copied!" })
    }
  }

  const handleResetProfile = () => {
    localStorage.removeItem("yinsee_provider")
    setProviderState(null)
    toast({ description: "Provider profile reset" })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="bg-card rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-sub font-semibold text-foreground mb-4">No provider profile yet</h2>
            <TextButton onClick={handleCreateProvider}>Create provider profile</TextButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-title font-bold text-foreground mb-6 text-center">Provider Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Provider ID Card */}
          <div className="bg-card rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sub">Your Provider ID: {provider.id}</span>
              <TextButton variant="pill-small" onClick={handleCopy}>
                Copy
              </TextButton>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-card rounded-lg p-4 md:p-6">
            <div className="text-center">
              <span className="text-sub text-foreground">Balance: {provider.walletCredits} credits</span>
              <div className="mt-3">
                <TextButton variant="pill" onClick={handleTopUp}>
                  Top up +5 (mock)
                </TextButton>
              </div>
            </div>
          </div>

          {/* Recent Feedback Card */}
          <div className="bg-card rounded-lg p-4 md:p-6">
            <h2 className="text-sub font-semibold text-foreground mb-3">Recent Feedback</h2>
            {recentFeedback.length === 0 ? (
              <p className="text-body text-muted">No feedback yet.</p>
            ) : (
              <div className="space-y-2">
                {recentFeedback.map((feedback: any, index: number) => (
                  <div key={index} className="border-b border-muted/20 pb-2 last:border-b-0 last:pb-0">
                    <div className="text-sm text-muted-foreground">
                      Rating: {feedback.rating}
                      {feedback.comment && ` — ${feedback.comment}`}
                      {` — ${new Date(feedback.createdAt).toLocaleDateString()}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Card */}
          <div className="bg-card rounded-lg p-4 md:p-6">
            <h2 className="text-sub font-semibold text-foreground mb-3">Recent Activity</h2>
            {recentActivities.length === 0 ? (
              <p className="text-body text-muted">No activity yet.</p>
            ) : (
              <div className="space-y-2">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {formatActivity(activity)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-muted mb-6">
          <p className="text-body">More provider features coming soon...</p>
        </div>

        <div className="text-center">
          <TextButton variant="destructive" onClick={handleResetProfile}>
            Reset provider profile
          </TextButton>
        </div>
      </div>
    </div>
  )
}
