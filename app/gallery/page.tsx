"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Navbar from "@/components/navbar"
import GalleryModal from "@/components/gallery-modal"
import Link from "next/link"
import { Loader2 } from "lucide-react"

interface Gallery {
  id: string
  title: string
  description: string
  image_url: string
}

export default function Gallery() {
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchGallery = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
        setIsAdmin(profile?.is_admin || false)
      }

      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

      if (!error && data) {
        setGallery(data)
      }
      setLoading(false)
    }

    fetchGallery()
  }, [supabase])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin-slow" />
            <p className="text-foreground/60">Loading gallery...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">Galeri</h1>
          {isAdmin && (
            <Link
              href="/gallery/admin"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 font-semibold"
            >
              Manage Gallery
            </Link>
          )}
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-lg text-foreground/60 mb-4">No images in gallery yet</p>
            {isAdmin && (
              <Link href="/gallery/admin" className="text-primary hover:underline font-semibold">
                Add your first image
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, idx) => (
              <div
                key={item.id}
                className="group cursor-pointer animate-fade-in"
                onClick={() => setSelectedImage(item)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="relative overflow-hidden rounded-lg h-64 bg-secondary border border-border group-hover:border-primary/50 transition-all duration-300">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                    <div className="w-full p-4 bg-gradient-to-t from-black via-black/50 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-200 truncate">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <GalleryModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  )
}
