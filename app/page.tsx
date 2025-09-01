"use client"

import Link from "next/link"
import { getProvider, setProvider } from "@/utils/provider-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function LandingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleOfferServices = () => {
    const existingProvider = getProvider()

    if (existingProvider) {
      // Provider already exists, show simple toast and navigate
      toast({
        title: "Provider profile already exists.",
      })
    } else {
      // No provider exists, create new one
      const newProvider = {
        id: generateProviderId(),
        walletCredits: 20,
        createdAt: new Date().toISOString(),
      }

      setProvider(newProvider)
      toast({
        title: "Provider profile created",
        description: `ID: ${newProvider.id} — Starting balance: 20 credits.`,
      })
    }

    router.push("/provider")
  }

  const generateProviderId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let id = "P-"

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const checkLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    id += "-" + checkLetters.charAt(Math.floor(Math.random() * checkLetters.length))

    return id
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 mt-8">
            <h1
              className="text-5xl font-bold font-serif text-[#EDEDED]"
              style={{ textShadow: "0 2px 24px rgba(255,255,255,0.08)" }}
            >
              YinSee Connect
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg border border-[rgba(122,122,230,0.60)] text-[#E0E0FF] bg-[rgba(122,122,230,0.15)] font-bold transition-all duration-[160ms] ease-out hover:bg-[rgba(122,122,230,0.35)] hover:border-[rgba(122,122,230,0.90)] hover:text-[#FFFFFF] hover:shadow-[0_6px_20px_rgba(122,122,230,0.25)] active:bg-[rgba(122,122,230,0.45)] active:scale-[0.97] active:shadow-[0_3px_12px_rgba(122,122,230,0.18)] focus-visible:outline-2 focus-visible:outline-[#7A7AE6] focus-visible:outline-offset-2 no-underline"
            >
              Find services
            </Link>
            <button
              onClick={handleOfferServices}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg border border-[rgba(122,122,230,0.60)] text-[#E0E0FF] bg-[rgba(122,122,230,0.15)] font-bold transition-all duration-[160ms] ease-out hover:bg-[rgba(122,122,230,0.35)] hover:border-[rgba(122,122,230,0.90)] hover:text-[#FFFFFF] hover:shadow-[0_6px_20px_rgba(122,122,230,0.25)] active:bg-[rgba(122,122,230,0.45)] active:scale-[0.97] active:shadow-[0_3px_12px_rgba(122,122,230,0.18)] focus-visible:outline-2 focus-visible:outline-[#7A7AE6] focus-visible:outline-offset-2"
            >
              Offer services
            </button>
            <Link
              href="/post-request"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg border border-[rgba(122,122,230,0.60)] text-[#E0E0FF] bg-[rgba(122,122,230,0.15)] font-bold transition-all duration-[160ms] ease-out hover:bg-[rgba(122,122,230,0.35)] hover:border-[rgba(122,122,230,0.90)] hover:text-[#FFFFFF] hover:shadow-[0_6px_20px_rgba(122,122,230,0.25)] active:bg-[rgba(122,122,230,0.45)] active:scale-[0.97] active:shadow-[0_3px_12px_rgba(122,122,230,0.18)] focus-visible:outline-2 focus-visible:outline-[#7A7AE6] focus-visible:outline-offset-2 no-underline"
            >
              Post a request
            </Link>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/taxi/request"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-lg border border-[rgba(122,122,230,0.60)] text-[#E0E0FF] bg-[rgba(122,122,230,0.15)] font-bold transition-all duration-[160ms] ease-out hover:bg-[rgba(122,122,230,0.35)] hover:border-[rgba(122,122,230,0.90)] hover:text-[#FFFFFF] hover:shadow-[0_6px_20px_rgba(122,122,230,0.25)] active:bg-[rgba(122,122,230,0.45)] active:scale-[0.97] active:shadow-[0_3px_12px_rgba(122,122,230,0.18)] focus-visible:outline-2 focus-visible:outline-[#7A7AE6] focus-visible:outline-offset-2 no-underline"
            >
              Call a taxi
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
