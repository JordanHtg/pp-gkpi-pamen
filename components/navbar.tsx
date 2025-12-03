"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import dynamic from "next/dynamic"

const NavbarUserNav = dynamic(() => import("./navbar-user-nav"), {
  ssr: false,
  loading: () => <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />,
})

const NavbarUserNavMobile = dynamic(() => import("./navbar-user-nav-mobile"), {
  ssr: false,
})

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Initialize Supabase client only on client side
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(prof)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = isActive(href)
    return (
      <Link
        href={href}
        className={`transition-all duration-300 font-medium ${
          active
            ? "text-gray-500 bg-gray-100 px-3 py-2 rounded-lg"
            : "text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-lg"
        }`}
      >
        {children}
      </Link>
    )
  }

  const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = isActive(href)
    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded transition-all duration-300 font-medium ${
          active ? "text-gray-500 bg-gray-100" : "text-gray-700 hover:bg-gray-100 hover:text-primary"
        }`}
        onClick={() => setIsOpen(false)}
      >
        {children}
      </Link>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity animate-fade-in"
          >
            <img src="/logo.jpg" alt="PP GKPI PAMEN" className="w-8 h-8 rounded-lg" />
            <span className="hidden sm:inline text-primary">PP GKPI PAMEN</span>
            <span className="sm:hidden text-primary">PAMEN</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/schedule">Schedule</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/chat">Chat</NavLink>

            <NavbarUserNav user={user} profile={profile} />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/about">About Us</MobileNavLink>
            <MobileNavLink href="/schedule">Schedule</MobileNavLink>
            <MobileNavLink href="/gallery">Gallery</MobileNavLink>
            <MobileNavLink href="/chat">Chat</MobileNavLink>

            <NavbarUserNavMobile user={user} profile={profile} isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        )}
      </div>
    </nav>
  )
}
