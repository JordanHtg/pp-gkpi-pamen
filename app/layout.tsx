import type React from "react"
// ... existing code ...
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PP GKPI PAMEN - Perkumpulan Pemuda Gereja GKPI",
  description: "Perkumpulan pemuda-pemudi gereja GKPI Pamen untuk pelayanan dan ibadah",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased bg-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
