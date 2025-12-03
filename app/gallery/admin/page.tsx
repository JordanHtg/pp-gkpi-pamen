"use client"

import type React from "react"
import { addGalleryImage } from "@/app/actions/gallery"
import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Trash2, Plus, Upload, Loader2, AlertCircle } from "lucide-react"

interface Gallery {
  id: string
  title: string
  description: string
  image_url: string
}

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return

    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      console.log("[v0] User ID:", user.id)
      console.log("[v0] Profile data:", profile)
      console.log("[v0] Profile error:", profileError)

      if (!profile?.is_admin) {
        router.push("/gallery")
        return
      }

      setIsAdmin(true)
      await fetchGallery()
    }

    checkAdmin()
  }, [supabase, router])

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

    if (data) {
      setGallery(data)
    }
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const result = await addGalleryImage({
        title,
        description,
        imageFile: imageFile as File,
      })

      if (result.error) {
        setError(result.error)
        setSubmitting(false)
        return
      }

      setTitle("")
      setDescription("")
      setImagePreview("")
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      await fetchGallery()
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError("Failed to upload image. Please try again.")
    }

    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await supabase.from("gallery").delete().eq("id", id)
      await fetchGallery()
    }
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-lg text-foreground/60">Access denied. Admin only.</p>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin-slow" />
            <p className="text-foreground/60">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-foreground animate-fade-in">Manage Gallery</h1>

        {/* Add New Image Form */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-8 mb-12 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Add New Image</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 animate-shake">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Image title"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Image description (optional)"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground transition-all duration-300"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Upload Image</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 text-foreground hover:bg-primary/5 font-medium"
              >
                <Upload size={20} />
                {imageFile ? "Change Image" : "Click to upload image"}
              </button>
            </div>

            {imagePreview && (
              <div className="w-full h-48 rounded-lg overflow-hidden bg-secondary border border-border animate-scale-in">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !imageFile}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin-slow" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Image
                </>
              )}
            </button>
          </form>
        </div>

        {/* Gallery List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Current Gallery ({gallery.length})</h2>

          {gallery.length === 0 ? (
            <p className="text-foreground/60">No images yet. Add one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in bg-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="h-40 bg-secondary overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
                    <p className="text-sm text-foreground/60 mb-4">{item.description}</p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:scale-105"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
