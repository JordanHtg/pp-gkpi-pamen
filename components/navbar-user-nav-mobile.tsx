"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface NavbarUserNavMobileProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function NavbarUserNavMobile({ isOpen, setIsOpen }: NavbarUserNavMobileProps) {
  const [user, setUser] = useState<any>(null)
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
      } catch (error) {
        console.error("[v0] Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      setIsOpen(false)
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    }
  }

  if (isLoading || !isOpen) {
    return null
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setIsOpen(false)}
      >
        Login
      </Link>
    )
  }

  return (
    <>
      <Link
        href="/profile"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
        onClick={() => setIsOpen(false)}
      >
        Profile
      </Link>
      <button
        onClick={() => {
          handleLogout()
        }}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
      >
        Logout
      </button>
    </>
  )
}
