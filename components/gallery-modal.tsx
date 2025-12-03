"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface GalleryModalProps {
  image: { id: string; title: string; image_url: string; description?: string } | null
  onClose: () => void
}

export default function GalleryModal({ image, onClose }: GalleryModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  if (!image) return null

  return (
    /* Added animations and modern styling to modal */
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto border-2 border-border shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border bg-secondary/50">
          <h2 className="text-xl font-bold text-foreground">{image.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-border rounded transition-colors duration-300 text-foreground hover:text-primary"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <img
            src={image.image_url || "/placeholder.svg"}
            alt={image.title}
            className="w-full h-auto rounded-lg mb-4"
          />
          {image.description && <p className="text-foreground/80 text-lg leading-relaxed">{image.description}</p>}
        </div>
      </div>
    </div>
  )
}
