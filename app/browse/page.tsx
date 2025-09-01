"use client"

import { TextButton } from "@/components/text-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getProvider, setProvider } from "@/utils/provider-store"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import { useActivityLog } from "@/hooks/use-activity-log"
import { useState } from "react"
import { FeedbackDialog } from "@/components/feedback-dialog"

interface Request {
  id: string
  category: string
  description: string
  suburb: string
  status: "OPEN" | "MATCHED"
  createdAt: string
}

export default function BrowsePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string>("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [isLocating, setIsLocating] = useState(false)
  const [requests, setRequests] = useLocalStorage<Request[]>("yinsee_requests", [])
  const { addActivity } = useActivityLog()

  const openRequests = requests.filter((request) => {
    if (request.status !== "OPEN") return false
    if (selectedArea === "all") return true
    return request.suburb.toLowerCase() === selectedArea.toLowerCase()
  })

  const { toast } = useToast()

  const handleConnectClick = (requestId: string) => {
    setSelectedRequestId(requestId)
    setIsDialogOpen(true)
  }

  const handleConfirm = () => {
    const p = getProvider()

    if (!p) {
      toast({
        description: "Please create a provider profile first.",
        variant: "destructive",
      })
      setIsDialogOpen(false)
      return
    }

    if (p.walletCredits >= 3) {
      p.walletCredits -= 3
      setProvider(p)

      const updatedRequests = requests.map((request) =>
        request.id === selectedRequestId ? { ...request, status: "MATCHED" as const } : request,
      )
      setRequests(updatedRequests)

      addActivity({
        type: "connected",
        requestId: selectedRequestId,
        debited: 3,
      })

      toast({
        description: "Connected — debited 3 credits",
      })

      setIsDialogOpen(false)
      setIsFeedbackDialogOpen(true)
    } else {
      toast({
        description: "Insufficient balance — please top up",
        variant: "destructive",
      })
      setIsDialogOpen(false)
    }
  }

  const handleUseLocation = () => {
    setIsLocating(true)

    if (!navigator.geolocation) {
      toast({
        description: "Location off — showing all areas",
        variant: "destructive",
      })
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Define approximate coordinates for NZ areas (city centers)
          const areas = [
            { name: "auckland", lat: -36.8485, lng: 174.7633 },
            { name: "wellington", lat: -41.2865, lng: 174.7762 },
            { name: "christchurch", lat: -43.5321, lng: 172.6362 },
            { name: "hamilton", lat: -37.787, lng: 175.2793 },
            { name: "tauranga", lat: -37.6878, lng: 176.1651 },
            { name: "dunedin", lat: -45.8788, lng: 170.5028 },
          ]

          // Calculate distance to each area and find nearest
          let nearestArea = "auckland"
          let minDistance = Number.POSITIVE_INFINITY

          areas.forEach((area) => {
            const distance = Math.sqrt(Math.pow(latitude - area.lat, 2) + Math.pow(longitude - area.lng, 2))
            if (distance < minDistance) {
              minDistance = distance
              nearestArea = area.name
            }
          })

          setSelectedArea(nearestArea)
          toast({
            description: `Location detected: ${nearestArea.charAt(0).toUpperCase() + nearestArea.slice(1)}`,
          })
        } catch (error) {
          toast({
            description: "Location off — showing all areas",
            variant: "destructive",
          })
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        toast({
          description: "Location off — showing all areas",
          variant: "destructive",
        })
        setIsLocating(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const StatusBadge = ({ status }: { status: "OPEN" | "MATCHED" }) => {
    const isOpen = status === "OPEN"
    const displayText = isOpen ? "Available" : "Connected"
    const bgColor = isOpen ? "bg-green-600" : "bg-blue-600"

    return <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${bgColor}`}>{displayText}</span>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-title text-foreground">Browse services</h1>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-4 items-center">
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="auckland">Auckland</SelectItem>
                <SelectItem value="wellington">Wellington</SelectItem>
                <SelectItem value="christchurch">Christchurch</SelectItem>
                <SelectItem value="hamilton">Hamilton</SelectItem>
                <SelectItem value="tauranga">Tauranga</SelectItem>
                <SelectItem value="dunedin">Dunedin</SelectItem>
              </SelectContent>
            </Select>
            <TextButton variant="pill" onClick={handleUseLocation} disabled={isLocating}>
              {isLocating ? "Locating…" : "Use my location"}
            </TextButton>
          </div>
        </div>

        <div className="space-y-6">
          {openRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-body text-muted">No Available requests in this area.</p>
            </div>
          ) : (
            openRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-2xl transition-all duration-160 ease-out cursor-default hover:bg-[#18181E] hover:border hover:border-[#7A7AE62E] motion-safe:hover:shadow-lg motion-safe:hover:shadow-black/20"
                style={{ backgroundColor: "#14141A" }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sub text-foreground">{request.category}</h3>
                      <StatusBadge status={request.status} />
                    </div>
                    <p className="text-body text-muted-foreground">
                      {request.suburb} · {request.description}
                    </p>
                  </div>
                  <TextButton variant="pill" onClick={() => handleConnectClick(request.id)}>
                    Connect
                  </TextButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm connection</DialogTitle>
            <DialogDescription>This will debit 3 credits from your wallet.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <TextButton onClick={() => setIsDialogOpen(false)}>Cancel</TextButton>
            <TextButton onClick={handleConfirm}>Confirm</TextButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FeedbackDialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen} providerId="P-QWERT-J" />
    </div>
  )
}
