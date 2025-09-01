import { useLocalStorage } from "./use-local-storage"

export interface ActivityLogEntry {
  type: "request_posted" | "connected" | "topup"
  category?: string
  suburb?: string
  requestId?: string
  debited?: number
  amount?: number
  createdAt: string
}

export function useActivityLog() {
  const [activities, setActivities] = useLocalStorage<ActivityLogEntry[]>("yinsee_activity", [])

  const addActivity = (entry: Omit<ActivityLogEntry, "createdAt">) => {
    const newEntry: ActivityLogEntry = {
      ...entry,
      createdAt: new Date().toISOString(),
    }
    setActivities([newEntry, ...activities])
  }

  const getRecentActivities = (limit = 5) => {
    return activities.slice(0, limit)
  }

  const formatActivity = (activity: ActivityLogEntry): string => {
    switch (activity.type) {
      case "request_posted":
        return `Request posted: ${activity.category}, ${activity.suburb}`
      case "connected":
        return `Connected request: ${activity.category}, ${activity.suburb} — debited ${activity.debited} credits`
      case "topup":
        return `Top up +${activity.amount} credits`
      default:
        return "Unknown activity"
    }
  }

  return {
    activities,
    addActivity,
    getRecentActivities,
    formatActivity,
  }
}
