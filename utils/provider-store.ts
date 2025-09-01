export interface Provider {
  id: string
  walletCredits: number
  createdAt: string
}

const STORAGE_KEY = "yinsee_provider"

// Generate a provider ID in format "P-XXXXX-C"
export function generateProviderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let middle = ""

  // Generate 5 random characters for XXXXX
  for (let i = 0; i < 5; i++) {
    middle += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  // Generate random check letter A-Z
  const checkLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))

  return `P-${middle}-${checkLetter}`
}

// Get provider from localStorage
export function getProvider(): Provider | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    return JSON.parse(stored) as Provider
  } catch (error) {
    console.error("Error reading provider from localStorage:", error)
    return null
  }
}

// Save provider to localStorage
export function setProvider(provider: Provider): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(provider))
  } catch (error) {
    console.error("Error saving provider to localStorage:", error)
  }
}

// Create a new provider with default values
export function createProvider(): Provider {
  return {
    id: generateProviderId(),
    walletCredits: 20,
    createdAt: new Date().toISOString(),
  }
}
