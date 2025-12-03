import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()
    const { title, description, image_url } = body

    // Validate input
    if (!title || !image_url) {
      return NextResponse.json({ error: "Missing required fields: title and image_url" }, { status: 400 })
    }

    // Create Supabase authenticated client to verify user
    const supabase = await createClient()

    // Get current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "You do not have admin permissions to upload images" }, { status: 403 })
    }

    console.log("[v0] Service Role Key available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    const supabaseServiceRole = createServiceRoleClient()

    // Insert into gallery table using service role (bypasses RLS)
    const { data, error: insertError } = await supabaseServiceRole.from("gallery").insert({
      title,
      description: description || null,
      image_url,
      uploaded_by: user.id,
    })

    if (insertError) {
      console.error("[v0] Gallery insert error:", insertError)
      console.error("[v0] Error details:", JSON.stringify(insertError))
      return NextResponse.json({ error: insertError.message || "Failed to insert gallery record" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("[v0] API error:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
