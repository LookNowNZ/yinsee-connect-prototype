"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Request {
  id: string
  category: string
  description: string
  suburb: string
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED"
  createdAt: string
}

interface RequestsContextType {
  requests: Request[]
  addRequest: (request: Request) => void
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined)

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([])

  const addRequest = (request: Request) => {
    setRequests((prev) => [request, ...prev]) // Add new requests to the beginning
  }

  return <RequestsContext.Provider value={{ requests, addRequest }}>{children}</RequestsContext.Provider>
}

export function useRequests() {
  const context = useContext(RequestsContext)
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider")
  }
  return context
}
