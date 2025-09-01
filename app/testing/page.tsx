"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TextButton } from "@/components/text-button"
import { useToast } from "@/hooks/use-toast"
import { useActivityLog } from "@/hooks/use-activity-log"

interface TesterReport {
  id: string
  timestamp: string
  deviceModel: string
  osVersion: string
  browserVersion: string
  pageFlow: string
  stepsToReproduce: string
  expectedResult: string
  actualResult: string
  severity: string
  notes: string
}

export default function TestingGuidePage() {
  const { toast } = useToast()
  const { logActivity } = useActivityLog()
  const [reports, setReports] = useState<TesterReport[]>([])
  const [showResetDialog, setShowResetDialog] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    deviceModel: "",
    osVersion: "",
    browserVersion: "",
    pageFlow: "",
    stepsToReproduce: "",
    expectedResult: "",
    actualResult: "",
    severity: "",
    notes: "",
  })

  useEffect(() => {
    const savedReports = localStorage.getItem("testerReports")
    if (savedReports) {
      setReports(JSON.parse(savedReports))
    }
  }, [])

  const handleSubmitReport = () => {
    // Validate required fields
    const requiredFields = [
      "deviceModel",
      "osVersion",
      "browserVersion",
      "pageFlow",
      "stepsToReproduce",
      "expectedResult",
      "actualResult",
      "severity",
    ]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newReport: TesterReport = {
      id: `report_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...formData,
    }

    const updatedReports = [...reports, newReport]
    setReports(updatedReports)
    localStorage.setItem("testerReports", JSON.stringify(updatedReports))

    // Log activity
    logActivity("tester_report", `Tester report submitted for ${formData.pageFlow}`)

    // Reset form
    setFormData({
      deviceModel: "",
      osVersion: "",
      browserVersion: "",
      pageFlow: "",
      stepsToReproduce: "",
      expectedResult: "",
      actualResult: "",
      severity: "",
      notes: "",
    })

    toast({
      title: "Report submitted",
      description: "Your tester report has been saved locally.",
    })
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(reports, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "yinsee-tester-reports.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyText = () => {
    const textSummary = reports
      .map(
        (report) =>
          `Report ID: ${report.id}
Date: ${new Date(report.timestamp).toLocaleString()}
Device: ${report.deviceModel}
OS: ${report.osVersion}
Browser: ${report.browserVersion}
Page/Flow: ${report.pageFlow}
Severity: ${report.severity}
Steps: ${report.stepsToReproduce}
Expected: ${report.expectedResult}
Actual: ${report.actualResult}
Notes: ${report.notes || "None"}
---`,
      )
      .join("\n\n")

    navigator.clipboard.writeText(textSummary)
    toast({
      title: "Reports copied",
      description: "All reports copied to clipboard as text.",
    })
  }

  const handleResetReports = () => {
    localStorage.removeItem("testerReports")
    setReports([])
    logActivity("tester_reset", "Tester reports data reset")
    setShowResetDialog(false)
    toast({
      title: "Reports reset",
      description: "All tester reports have been cleared.",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Testing guide URL copied to clipboard.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-serif mb-4">Testing Guide</h1>
          <p className="text-muted-foreground">Comprehensive testing documentation for YinSee Connect</p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This is a clickable prototype running in mock mode using localStorage for data persistence. No server
              connection is required.
            </p>
            <p>
              <strong>Supported Pages:</strong> Landing, Browse, Post Request, Account, Provider Dashboard, Stats,
              Testing Guide
            </p>
          </CardContent>
        </Card>

        {/* What's Live */}
        <Card>
          <CardHeader>
            <CardTitle>What's Live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Provider Flow:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Create profile → unique ID → wallet (mock top-up) → activity log → reset profile (with confirmation)
                </li>
                <li>Taxi driver registration with approval workflow</li>
                <li>Connect to requests with 3-credit deduction</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">User Flow:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Post request (Category/Description/Suburb required) → view in Account → browse → connect → leave
                  feedback
                </li>
                <li>Taxi request flow with geolocation and typeahead pickup location</li>
                <li>Feedback system with ratings and comments</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Status flags: "Available" (green) and "Connected" (accent)</li>
                <li>Global styling: high-contrast buttons, input hover/focus, dialogs, warnings</li>
                <li>Minimum 44px tap targets for accessibility</li>
                <li>Real geolocation API integration</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How to Test */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Provider Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Create profile and copy Provider ID</li>
                <li>Mock top-up wallet (+5 credits)</li>
                <li>Connect to a request</li>
                <li>Verify 3-credit deduction on connect</li>
                <li>Check Recent Activity shows events</li>
                <li>Reset provider profile (confirm dialog, red danger button, large warning icon)</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-3">User Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Post a request with all required fields</li>
                <li>See it in Account page</li>
                <li>Browse and connect to services</li>
                <li>Leave feedback (rating 1–5, optional comment ≤200 chars)</li>
                <li>Confirm request status flags update correctly</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Visual Checks:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Button contrast and hover/focus visibility</li>
                <li>Dialogs distinct from background</li>
                <li>Warning icons ≥32px left-aligned</li>
                <li>Status chips clear: "Available" (green), "Connected" (accent)</li>
                <li>Form fields with proper hover/focus states</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Setup (PWA-style)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">iOS Safari:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Open the app in Safari</li>
                <li>Tap the Share button (square with arrow up)</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Android Chrome:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Open the app in Chrome</li>
                <li>Tap the menu (three dots)</li>
                <li>Tap "Add to Home screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
            <p className="text-sm text-muted-foreground">
              This creates an app-like icon and full-screen experience. No native build required.
            </p>
          </CardContent>
        </Card>

        {/* Export/Print */}
        <Card>
          <CardHeader>
            <CardTitle>Export/Print</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <TextButton onClick={handlePrint}>Print Testing Guide</TextButton>
              <TextButton variant="secondary" onClick={handleCopyLink}>
                Copy Testing Guide Link
              </TextButton>
            </div>
          </CardContent>
        </Card>

        {/* Tester Report Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit a Tester Report</CardTitle>
            <CardDescription>Report issues or feedback about the prototype</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Device Model *</label>
                <input
                  type="text"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                  placeholder="e.g., iPhone 14, Samsung Galaxy S23"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OS & Version *</label>
                <input
                  type="text"
                  value={formData.osVersion}
                  onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })}
                  placeholder="e.g., iOS 17.1, Android 14"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Browser & Version *</label>
                <input
                  type="text"
                  value={formData.browserVersion}
                  onChange={(e) => setFormData({ ...formData, browserVersion: e.target.value })}
                  placeholder="e.g., Safari 17, Chrome 119"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Page / Flow *</label>
                <select
                  value={formData.pageFlow}
                  onChange={(e) => setFormData({ ...formData, pageFlow: e.target.value })}
                  className="w-full"
                >
                  <option value="">Select page/flow</option>
                  <option value="Landing">Landing</option>
                  <option value="Browse">Browse</option>
                  <option value="Post Request">Post Request</option>
                  <option value="Account">Account</option>
                  <option value="Provider Dashboard">Provider Dashboard</option>
                  <option value="Stats">Stats</option>
                  <option value="Testing Guide">Testing Guide</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Steps to Reproduce *</label>
              <textarea
                value={formData.stepsToReproduce}
                onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                placeholder="1. Go to... 2. Click on... 3. Enter..."
                rows={3}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expected Result *</label>
              <textarea
                value={formData.expectedResult}
                onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                placeholder="What should happen..."
                rows={2}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Actual Result *</label>
              <textarea
                value={formData.actualResult}
                onChange={(e) => setFormData({ ...formData, actualResult: e.target.value })}
                placeholder="What actually happened..."
                rows={2}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Severity *</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full"
              >
                <option value="">Select severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional context or observations..."
                rows={2}
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <TextButton onClick={handleSubmitReport}>Submit Report</TextButton>
              <TextButton variant="secondary" onClick={handleExportJSON}>
                Export All Reports (JSON)
              </TextButton>
              <TextButton variant="secondary" onClick={handleCopyText}>
                Copy All Reports (Text)
              </TextButton>
              <TextButton variant="destructive" onClick={() => setShowResetDialog(true)}>
                <span className="mr-2">⚠️</span>
                Reset Test Data
              </TextButton>
            </div>

            {reports.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {reports.length} report{reports.length !== 1 ? "s" : ""} saved locally
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-red-500 text-3xl">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Reset Test Data?</h3>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete all tester reports. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <TextButton variant="secondary" onClick={() => setShowResetDialog(false)}>
                Cancel
              </TextButton>
              <TextButton variant="destructive" onClick={handleResetReports}>
                Reset Reports
              </TextButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
