"use client"

import Navbar from "@/components/navbar"
import Link from "next/link"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center animate-fade-in">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Something went wrong!</h1>
          <p className="text-lg text-foreground/60 mb-8 max-w-md">
            An error occurred while processing your request. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 font-semibold"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300 font-semibold"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
