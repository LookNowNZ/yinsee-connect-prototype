"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/account", label: "Account" },
  { href: "/provider", label: "Provider" },
  { href: "/stats", label: "Stats" },
]

function NavInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isTestMode = searchParams.get("test") === "1"

  return (
    <>
      {isTestMode && (
        <div className="bg-yellow-600 text-black text-xs py-1 px-3 fixed top-0 left-0 z-50 rounded-br-md font-medium">
          TEST MODE
        </div>
      )}

      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="font-serif text-2xl font-bold text-primary transition-all duration-160 ease-out hover:text-[#8A8AEA] hover:underline motion-safe:hover:scale-102 motion-safe:hover:shadow-[0_8px_24px_-16px_rgba(122,122,230,0.2)] active:scale-99 active:shadow-[0_4px_16px_-12px_rgba(122,122,230,0.15)] active:transition-all active:duration-80 active:ease-in"
            >
              YinSee
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-160 ease-out hover:text-[#8A8AEA] hover:underline motion-safe:hover:scale-102 motion-safe:hover:shadow-[0_8px_24px_-16px_rgba(122,122,230,0.2)] active:scale-99 active:shadow-[0_4px_16px_-12px_rgba(122,122,230,0.15)] active:transition-all active:duration-80 active:ease-in",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/testing"
                className={cn(
                  "text-sm font-medium transition-all duration-160 ease-out hover:text-[#8A8AEA] hover:underline motion-safe:hover:scale-102 motion-safe:hover:shadow-[0_8px_24px_-16px_rgba(122,122,230,0.2)] active:scale-99 active:shadow-[0_4px_16px_-12px_rgba(122,122,230,0.15)] active:transition-all active:duration-80 active:ease-in",
                  pathname === "/testing" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Testing
              </Link>
              {isTestMode && (
                <Link
                  href="/testing"
                  className="bg-yellow-600 text-black px-3 py-1 rounded text-xs font-medium hover:bg-yellow-500"
                >
                  Testing
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export function Navigation() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  )
}
