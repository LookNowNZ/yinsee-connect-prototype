"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TextButton } from "@/components/text-button"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useActivityLog } from "@/hooks/use-activity-log"

interface Request {
  id: string
  category: string
  description: string
  suburb: string
  status: "OPEN" | "MATCHED"
  createdAt: string
}

export default function PostRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useLocalStorage<Request[]>("yinsee_requests", [])
  const { addActivity } = useActivityLog()

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    suburb: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const newErrors: Record<string, string> = {}
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.suburb) newErrors.suburb = "Suburb is required"

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Create mock request object
    const mockRequest: Request = {
      id: `req_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      category: formData.category,
      description: formData.description,
      suburb: formData.suburb,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    }

    setRequests([...requests, mockRequest])

    addActivity({
      type: "request_posted",
      category: formData.category,
      suburb: formData.suburb,
    })

    // Show success toast
    toast({
      title: "Request posted",
      description: "Your service request has been posted successfully.",
    })

    // Navigate to account page
    router.push("/account")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-2xl p-6">
              <h1 className="text-title text-center mb-6">Post a request</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Select */}
                <div>
                  <label htmlFor="category" className="block text-sub mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full min-h-[44px] bg-[#1A1A22] border border-[#444] rounded-md px-3 py-2 font-sans text-base font-normal text-foreground placeholder:text-[#AAA] focus:outline-none focus:border-[#7A7AE6] focus:bg-[#22222A] focus:shadow-[0_0_4px_rgba(122,122,230,0.5)] hover:border-[#666] transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Handyman">Handyman</option>
                  </select>
                  {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Description Textarea */}
                <div>
                  <label htmlFor="description" className="block text-sub mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    maxLength={280}
                    rows={4}
                    className="w-full min-h-[44px] bg-[#1A1A22] border border-[#444] rounded-md px-3 py-2 font-sans text-base font-normal text-foreground placeholder:text-[#AAA] focus:outline-none focus:border-[#7A7AE6] focus:bg-[#22222A] focus:shadow-[0_0_4px_rgba(122,122,230,0.5)] hover:border-[#666] transition-all duration-200 resize-none"
                    placeholder="Briefly describe what you need"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description ? (
                      <p className="text-red-400 text-sm">{errors.description}</p>
                    ) : (
                      <p className="text-muted text-sm">Briefly describe what you need</p>
                    )}
                    <p className="text-muted text-sm">{formData.description.length}/280</p>
                  </div>
                </div>

                {/* Suburb Input */}
                <div>
                  <label htmlFor="suburb" className="block text-sub mb-2">
                    Suburb *
                  </label>
                  <input
                    type="text"
                    id="suburb"
                    value={formData.suburb}
                    onChange={(e) => handleInputChange("suburb", e.target.value)}
                    className="w-full min-h-[44px] bg-[#1A1A22] border border-[#444] rounded-md px-3 py-2 font-sans text-base font-normal text-foreground placeholder:text-[#AAA] focus:outline-none focus:border-[#7A7AE6] focus:bg-[#22222A] focus:shadow-[0_0_4px_rgba(122,122,230,0.5)] hover:border-[#666] transition-all duration-200"
                    placeholder="Enter your suburb"
                  />
                  {errors.suburb && <p className="text-red-400 text-sm mt-1">{errors.suburb}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <TextButton variant="pill" type="submit" className="w-full">
                    Submit request
                  </TextButton>
                </div>
              </form>

              {/* Preview Mode Note */}
              <p className="text-muted text-sm text-center mt-4">Preview mode — mock data (not saved to a server).</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
