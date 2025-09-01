export interface TaxiCredentials {
  id: string
  driverName: string
  licenceNumber: string
  pEndorsement: { has: boolean; docUrl?: string }
  pslNumberOrLabel: string
  cofExpiry: string
  medicalProvided: boolean
  rightToWorkConfirmed: boolean
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export interface TaxiRequest {
  id: string
  status: "available" | "connected"
  createdAt: string
  area: "Auckland" | "Wellington" | "Christchurch" | "Hamilton" | "Tauranga" | "Dunedin"
  pickup: { text: string }
  destination: { text: string }
  notes?: string
  fareEstimate?: number
}

export interface TaxiActivity {
  type: "taxi_request_posted" | "taxi_connected" | "taxi_credentials_submitted"
  requestId?: string
  area?: string
  pickup?: string
  destination?: string
  createdAt: string
}

// Storage keys
const TAXI_CREDENTIALS_KEY = "yinsee_taxi_credentials"
const TAXI_REQUESTS_KEY = "yinsee_taxi_requests"
const TAXI_ACTIVITY_KEY = "yinsee_taxi_activity"

// Helper function to safely access localStorage
function safeLocalStorage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null
  } catch {
    return null
  }
}

// Taxi Credentials functions
export function getTaxiCredentials(): TaxiCredentials | null {
  const storage = safeLocalStorage()
  if (!storage) return null

  try {
    const stored = storage.getItem(TAXI_CREDENTIALS_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setTaxiCredentials(credentials: TaxiCredentials): void {
  const storage = safeLocalStorage()
  if (!storage) return

  try {
    storage.setItem(TAXI_CREDENTIALS_KEY, JSON.stringify(credentials))
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Taxi Requests functions
export function getTaxiRequests(): TaxiRequest[] {
  const storage = safeLocalStorage()
  if (!storage) return []

  try {
    const stored = storage.getItem(TAXI_REQUESTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function setTaxiRequests(requests: TaxiRequest[]): void {
  const storage = safeLocalStorage()
  if (!storage) return

  try {
    storage.setItem(TAXI_REQUESTS_KEY, JSON.stringify(requests))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function addTaxiRequest(requestData: {
  pickup: string
  destination: string
  area: string
  notes?: string
}): void {
  try {
    const requests = getTaxiRequests()

    const newRequest: TaxiRequest = {
      id: generateTaxiRequestId(),
      status: "available",
      createdAt: new Date().toISOString(),
      area: requestData.area as TaxiRequest["area"],
      pickup: { text: requestData.pickup },
      destination: { text: requestData.destination },
      notes: requestData.notes,
    }

    requests.push(newRequest)
    setTaxiRequests(requests)

    // Log activity
    addTaxiActivity({
      type: "taxi_request_posted",
      requestId: newRequest.id,
      area: newRequest.area,
      pickup: newRequest.pickup.text,
      destination: newRequest.destination.text,
    })
  } catch {
    // Silently fail if localStorage operations fail
  }
}

// Taxi Activity functions
export function addTaxiActivity(event: Omit<TaxiActivity, "createdAt">): void {
  const storage = safeLocalStorage()
  if (!storage) return

  try {
    const existing = storage.getItem(TAXI_ACTIVITY_KEY)
    const activities: TaxiActivity[] = existing ? JSON.parse(existing) : []

    const newActivity: TaxiActivity = {
      ...event,
      createdAt: new Date().toISOString(),
    }

    activities.push(newActivity)
    storage.setItem(TAXI_ACTIVITY_KEY, JSON.stringify(activities))
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function getTaxiActivity(): TaxiActivity[] {
  const storage = safeLocalStorage()
  if (!storage) return []

  try {
    const stored = storage.getItem(TAXI_ACTIVITY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Seeding function
export function seedTaxiIfEmpty(): void {
  const storage = safeLocalStorage()
  if (!storage) return

  try {
    // Ensure taxi requests array exists (empty on first load)
    const existingRequests = storage.getItem(TAXI_REQUESTS_KEY)
    if (!existingRequests) {
      storage.setItem(TAXI_REQUESTS_KEY, JSON.stringify([]))
    }

    // Ensure taxi activity array exists (empty on first load)
    const existingActivity = storage.getItem(TAXI_ACTIVITY_KEY)
    if (!existingActivity) {
      storage.setItem(TAXI_ACTIVITY_KEY, JSON.stringify([]))
    }
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Filtering and connection functions
export function getOpenTaxiRequestsByArea(area: string): TaxiRequest[] {
  const allRequests = getTaxiRequests()
  return allRequests.filter((request) => request.status === "available" && (area === "All" || request.area === area))
}

export function connectTaxiRequest(requestId: string): boolean {
  try {
    const requests = getTaxiRequests()
    const requestIndex = requests.findIndex((req) => req.id === requestId)

    if (requestIndex === -1) return false

    // Update request status
    requests[requestIndex].status = "connected"
    setTaxiRequests(requests)

    // Log activity
    const request = requests[requestIndex]
    addTaxiActivity({
      type: "taxi_connected",
      requestId: request.id,
      area: request.area,
      pickup: request.pickup.text,
      destination: request.destination.text,
    })

    return true
  } catch {
    return false
  }
}

// Generate unique taxi request ID
export function generateTaxiRequestId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "ride_"
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Generate unique taxi credentials ID
export function generateTaxiCredentialsId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "taxi_cred_"
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
