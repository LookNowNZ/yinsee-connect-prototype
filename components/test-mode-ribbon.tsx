"use client"

import { useEffect, useState } from "react"

export function TestModeRibbon() {
  const [showTestMode, setShowTestMode] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isTestMode = urlParams.get("test") === "1"
    setShowTestMode(isTestMode)

    console.log("[v0] Test mode check:", isTestMode ? "enabled" : "disabled")
  }, [])

  if (!showTestMode) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "#7A7AE6",
        color: "white",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "700",
        zIndex: 9999,
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      TEST MODE
    </div>
  )
}
