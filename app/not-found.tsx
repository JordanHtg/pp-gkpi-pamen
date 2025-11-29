import Navbar from "@/components/navbar"
import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center animate-fade-in">
          <div className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Page Not Found</h1>
          <p className="text-lg text-foreground/60 mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 font-semibold"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}
