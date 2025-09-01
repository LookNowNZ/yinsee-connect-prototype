"use client"

import { TextButton } from "@/components/text-button"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

interface Request {
  id: string
  category: string
  description: string
  suburb: string
  status: "OPEN" | "MATCHED"
  createdAt: string
}

interface TaxiRequest {
  id: string
  pickup: string
  destination: string
  area: string
  notes?: string
  status: "available" | "connected"
  createdAt: string
}

export default function AccountPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useLocalStorage<Request[]>("yinsee_requests", [])
  const [taxiRequests, setTaxiRequests] = useLocalStorage<TaxiRequest[]>("yinsee_taxi_requests", [])
  const router = useRouter()
  const [showResetDialog, setShowResetDialog] = useState(false)

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText("U-ABCDE-1")
      toast({
        title: "Copied!",
        duration: 2000,
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const StatusBadge = ({ status }: { status: "OPEN" | "MATCHED" }) => {
    const isOpen = status === "OPEN"
    const displayText = isOpen ? "Available" : "Connected"
    const bgColor = isOpen ? "bg-green-600" : "bg-blue-600"

    return <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${bgColor}`}>{displayText}</span>
  }

  const TaxiStatusBadge = ({ status }: { status: "available" | "connected" }) => {
    const isAvailable = status === "available"
    const displayText = isAvailable ? "Available" : "Connected"
    const bgColor = isAvailable ? "bg-green-600" : "bg-blue-600"

    return <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${bgColor}`}>{displayText}</span>
  }

  const resetAppData = () => {
    localStorage.removeItem("yinsee_requests")
    localStorage.removeItem("yinsee_provider")
    localStorage.removeItem("yinsee_activity")

    toast({
      title: "All app data reset",
      duration: 2000,
    })
    setShowResetDialog(false)

    router.push("/")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-title text-foreground mb-8">My Account</h1>

          <div className="bg-card p-4 rounded-2xl mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sub text-foreground">Your User ID: U-ABCDE-1</h3>
              <TextButton onClick={copyUserId}>Copy</TextButton>
            </div>
          </div>

          <div className="bg-card p-4 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sub text-foreground">My Requests</h2>
              <Link href="/post-request">
                <TextButton>Post a request</TextButton>
              </Link>
            </div>
            {requests.length === 0 ? (
              <p className="text-body text-muted">No requests yet. Try posting one.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between py-2 border-b border-muted/10 last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-body text-foreground">{request.category}</span>
                        <span className="text-muted">•</span>
                        <span className="text-body text-foreground">{request.suburb}</span>
                        <span className="text-muted">—</span>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm text-muted mt-1">Posted {formatTimeAgo(request.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card p-4 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sub text-foreground">My Taxi Requests</h2>
            </div>
            {taxiRequests.length === 0 ? (
              <p className="text-body text-muted">No taxi requests yet.</p>
            ) : (
              <div className="space-y-3">
                {taxiRequests
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between py-2 border-b border-muted/10 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-body text-foreground">{request.pickup}</span>
                          <span className="text-muted">→</span>
                          <span className="text-body text-foreground">{request.destination}</span>
                          <span className="text-muted">—</span>
                          <TaxiStatusBadge status={request.status} />
                        </div>
                        <p className="text-sm text-muted mt-1">Created {formatTimeAgo(request.createdAt)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-card p-4 rounded-2xl">
            <p className="text-body text-muted">Account management features coming soon.</p>
          </div>

          <div className="mt-8 text-center">
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <DialogTrigger asChild>
                <div className="inline-block" title="Removes local test data. Can't be undone.">
                  <TextButton className="text-red-500 hover:text-red-400 hover:underline transition-all duration-160 ease-out">
                    Reset app data (local)
                  </TextButton>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-card border-muted/20">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Reset all app data?</DialogTitle>
                  <DialogDescription className="text-muted">
                    Removes local test data from this browser.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-3 justify-end mt-6">
                  <TextButton onClick={() => setShowResetDialog(false)}>Cancel</TextButton>
                  <TextButton
                    onClick={resetAppData}
                    className="text-red-500 hover:text-red-400 hover:underline transition-all duration-160 ease-out"
                  >
                    Reset all data
                  </TextButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
