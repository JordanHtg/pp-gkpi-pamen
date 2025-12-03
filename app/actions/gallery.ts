"use server"

import { createClient as createServiceRoleClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

export async function addGalleryImage({
  title,
  description,
  imageFile,
}: {
  title: string
  description: string
  imageFile: File
}) {
  try {
    console.log("[v0] Starting gallery upload...")
    console.log("[v0] Service role key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log("[v0] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("[v0] No authenticated user")
      return { error: "Not authenticated" }
    }

    console.log("[v0] User authenticated:", user.id)

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    console.log("[v0] Profile check - admin:", profile?.is_admin, "error:", profileError)

    if (!profile?.is_admin) {
      console.error("[v0] User is not admin")
      return { error: "Admin access required" }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      console.error("[v0] Missing NEXT_PUBLIC_SUPABASE_URL")
      return { error: "Server configuration error: Missing NEXT_PUBLIC_SUPABASE_URL" }
    }

    if (!serviceRoleKey) {
      console.error("[v0] Missing SUPABASE_SERVICE_ROLE_KEY")
      return { error: "Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY" }
    }

    console.log("[v0] Creating service role client...")
    const supabaseServiceRole = createServiceRoleClient(supabaseUrl, serviceRoleKey)

    const fileName = `${Date.now()}-${imageFile.name}`
    console.log("[v0] Uploading file:", fileName)

    const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
      .from("gallery")
      .upload(fileName, imageFile, { upsert: false })

    if (uploadError) {
      console.error("[v0] Storage upload error:", JSON.stringify(uploadError))
      return { error: `Upload failed: ${uploadError.message}` }
    }

    console.log("[v0] File uploaded successfully:", uploadData)

    // Get public URL
    const { data: publicUrlData } = supabaseServiceRole.storage.from("gallery").getPublicUrl(fileName)
    console.log("[v0] Public URL:", publicUrlData.publicUrl)

    // Use service role client to insert into gallery table (bypasses RLS)
    console.log("[v0] Inserting into gallery table...")
    const { data: insertData, error: insertError } = await supabaseServiceRole
      .from("gallery")
      .insert([
        {
          title,
          description,
          image_url: publicUrlData.publicUrl,
          uploaded_by: user.id,
        },
      ])
      .select()

    if (insertError) {
      console.error("[v0] Database insert error:", JSON.stringify(insertError))
      return { error: `Failed to save image: ${insertError.message}` }
    }

    console.log("[v0] Gallery image added successfully")
    return { success: true, data: insertData }
  } catch (error: any) {
    console.error("[v0] Gallery action error:", error)
    console.error("[v0] Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return { error: error.message || "Failed to upload image" }
  }
}
