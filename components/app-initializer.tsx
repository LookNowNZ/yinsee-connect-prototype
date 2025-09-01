"use client"

import { useEffect } from "react"

export function AppInitializer() {
  useEffect(() => {
    console.log("[v0] AppInitializer starting - checking localStorage")

    const existingRequests = localStorage.getItem("yinsee_requests")
    console.log("[v0] Existing requests found:", existingRequests ? "Yes" : "No")

    if (!existingRequests) {
      console.log("[v0] Initializing sample requests data")
      const sampleRequests = [
        {
          id: "req_sample1",
          category: "Plumber",
          description: "Fix leaking tap",
          suburb: "Christchurch",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        },
        {
          id: "req_sample2",
          category: "Electrician",
          description: "Replace light fitting",
          suburb: "Wellington",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        },
        {
          id: "req_sample3",
          category: "Handyman",
          description: "Assemble flatpack",
          suburb: "Auckland",
          status: "OPEN",
          createdAt: new Date().toISOString(),
        },
      ]

      localStorage.setItem("yinsee_requests", JSON.stringify(sampleRequests))
      console.log("[v0] Sample requests saved to localStorage")
    } else {
      console.log("[v0] Using existing requests from localStorage")
    }

    console.log("[v0] AppInitializer complete")
  }, [])

  return null
}
