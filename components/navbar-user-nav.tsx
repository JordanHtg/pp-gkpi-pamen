"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function NavbarUserNav() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          setProfile(prof)
        }
      } catch (error) {
        console.error("[v0] Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    let subscription: any
    const setupSubscription = async () => {
      try {
        const supabase = createClient()
        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange(() => {
          checkUser()
        })
        subscription = sub
      } catch (error) {
        console.error("[v0] Error setting up subscription:", error)
      }
    }

    setupSubscription()

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="hidden md:flex items-center gap-4">
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return (
      <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Login
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/profile"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url || "/placeholder.svg"}
            alt={profile.full_name}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 bg-blue-400 rounded-full" />
        )}
        <span className="hidden sm:inline">Profile</span>
      </Link>
      <button onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
        Logout
      </button>
    </div>
  )
}
