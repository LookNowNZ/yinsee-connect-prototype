import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 YinSee Connect. Preview mode — mock data (not saved to a server).
          </div>
          <div className="flex items-center gap-6">
            <Link href="/testing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Testing Guide
            </Link>
            <Link href="/stats" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Stats
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
