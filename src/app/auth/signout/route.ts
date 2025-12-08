import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Verifies if session exists 
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  // Redirect to login 
  return NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  })
}