"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Feedback {
  providerId: string
  rating: number
  comment: string
  createdAt: string
}

interface FeedbackContextType {
  feedback: Feedback[]
  addFeedback: (feedback: Omit<Feedback, "createdAt">) => void
  getProviderFeedback: (providerId: string) => Feedback[]
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback[]>([])

  const addFeedback = (newFeedback: Omit<Feedback, "createdAt">) => {
    const feedbackWithTimestamp = {
      ...newFeedback,
      createdAt: new Date().toISOString(),
    }
    setFeedback((prev) => [...prev, feedbackWithTimestamp])
  }

  const getProviderFeedback = (providerId: string) => {
    return feedback
      .filter((f) => f.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2) // Last 2 feedback items
  }

  return (
    <FeedbackContext.Provider value={{ feedback, addFeedback, getProviderFeedback }}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider")
  }
  return context
}
