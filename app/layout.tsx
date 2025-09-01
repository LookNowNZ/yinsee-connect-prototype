import type React from "react"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { BalanceProvider } from "@/contexts/balance-context"
import { RequestsProvider } from "@/contexts/requests-context"
import { FeedbackProvider } from "@/contexts/feedback-context"
import { Toaster } from "@/components/ui/toaster"
import { AppInitializer } from "@/components/app-initializer"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TestModeRibbon } from "@/components/test-mode-ribbon"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  title: "YinSee Connect",
  description: "Your gateway to discovering and connecting with service providers",
  generator: "v0.app",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B0B0F",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log("[v0] YinSee app layout initializing")

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans.variable} antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YinSee" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
      </head>
      <body className="font-sans min-h-screen flex flex-col app-root">
        <AppInitializer />
<Suspense fallback={null}>
  <TestModeRibbon />
</Suspense>

        <div className="bg-card border-b border-muted/20 py-2 px-4 text-center">
          <p className="text-muted text-sm">Preview mode — mock data (not saved to a server)</p>
        </div>
        <Navigation />
        <RequestsProvider>
          <BalanceProvider>
            <FeedbackProvider>
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </FeedbackProvider>
          </BalanceProvider>
        </RequestsProvider>
      </body>
    </html>
  )
}
