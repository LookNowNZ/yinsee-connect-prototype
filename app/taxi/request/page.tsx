"use client"

import type React from "react"
import type { MouseEvent } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TextButton } from "@/components/text-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { addTaxiRequest } from "@/utils/taxi-store"

const NZ_AREAS = ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin"]

const NZ_PLACES = [
  "Auckland",
  "Wellington",
  "Christchurch",
  "Hamilton",
  "Tauranga",
  "Dunedin",
  "Nelson",
  "Napier",
  "Hastings",
  "Palmerston North",
  "New Plymouth",
  "Rotorua",
  "Whangārei",
  "Invercargill",
  "Upper Hutt",
  "Lower Hutt",
  "Porirua",
  "Whanganui",
  "Gisborne",
]

export default function TaxiRequestPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [area, setArea] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredPlaces, setFilteredPlaces] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pickup.trim()) {
      const filtered = NZ_PLACES.filter((place) => place.toLowerCase().includes(pickup.toLowerCase())).slice(0, 8)
      setFilteredPlaces(filtered)
      setShowDropdown(filtered.length > 0)
    } else {
      setFilteredPlaces([])
      setShowDropdown(false)
    }
    setSelectedIndex(-1)
  }, [pickup])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredPlaces.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredPlaces.length) {
          selectPlace(filteredPlaces[selectedIndex])
        }
        break
      case "Escape":
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  const selectPlace = (place: string) => {
    setPickup(place)
    setShowDropdown(false)
    setSelectedIndex(-1)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pickup.trim() || !destination.trim() || !area) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const rideRequest = {
        pickup: pickup.trim(),
        destination: destination.trim(),
        area,
        notes: notes.trim(),
      }

      addTaxiRequest(rideRequest)

      toast({
        title: "Taxi requested — drivers in your area can now connect.",
      })

      router.push("/account")
    } catch (error) {
      toast({
        title: "Failed to request taxi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseLocation = () => {
    setIsLocating(true)

    if (!navigator.geolocation) {
      toast({
        description: "Location off — please select an area.",
        variant: "destructive",
      })
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        const areaCoords = {
          Auckland: { lat: -36.8485, lng: 174.7633 },
          Wellington: { lat: -41.2865, lng: 174.7762 },
          Christchurch: { lat: -43.5321, lng: 172.6362 },
          Hamilton: { lat: -37.787, lng: 175.2793 },
          Tauranga: { lat: -37.6878, lng: 176.1651 },
          Dunedin: { lat: -45.8788, lng: 170.5028 },
        }

        let nearestArea = "Auckland"
        let minDistance = Number.POSITIVE_INFINITY

        Object.entries(areaCoords).forEach(([areaName, coords]) => {
          const distance = Math.sqrt(Math.pow(latitude - coords.lat, 2) + Math.pow(longitude - coords.lng, 2))
          if (distance < minDistance) {
            minDistance = distance
            nearestArea = areaName
          }
        })

        setArea(nearestArea)
        setPickup(nearestArea)

        toast({
          description: `Using your location — set to ${nearestArea}.`,
        })
        setIsLocating(false)
      },
      (error) => {
        console.log("[v0] Geolocation error:", error)
        toast({
          description: "Location off — please select an area.",
          variant: "destructive",
        })
        setIsLocating(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Call a taxi</h1>

          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="pickup">Pickup location *</Label>
                  <Input
                    ref={inputRef}
                    id="pickup"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start typing a New Zealand location..."
                    required
                    autoComplete="off"
                  />
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
                    >
                      {filteredPlaces.map((place, index) => (
                        <div
                          key={place}
                          className={`px-3 py-2 cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground ${
                            index === selectedIndex ? "bg-accent text-accent-foreground" : ""
                          }`}
                          onClick={() => selectPlace(place)}
                        >
                          {place}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <div className="flex gap-4 items-center">
                    <Select value={area} onValueChange={setArea} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your area" />
                      </SelectTrigger>
                      <SelectContent>
                        {NZ_AREAS.map((areaOption) => (
                          <SelectItem key={areaOption} value={areaOption}>
                            {areaOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <TextButton variant="pill" onClick={handleUseLocation} disabled={isLocating}>
                      {isLocating ? "Locating…" : "Use my location"}
                    </TextButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.slice(0, 140))}
                    placeholder="Any special instructions or notes"
                    maxLength={140}
                    rows={3}
                  />
                  <div className="text-sm text-muted-foreground text-right">{notes.length}/140</div>
                </div>

                <div className="flex justify-center">
                  <TextButton type="submit" disabled={isSubmitting} variant="default" className="w-full max-w-xs">
                    {isSubmitting ? "Requesting..." : "Request taxi"}
                  </TextButton>
                </div>
              </form>

              <div className="mt-6 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">In mock mode, drivers see requests by Area</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
