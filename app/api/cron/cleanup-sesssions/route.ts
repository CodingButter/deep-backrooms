// app/api/cron/cleanup-sesssions/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db/schema/agentconversation"
import { sessions } from "@/db/schema/agentconversation"
import { lt } from "drizzle-orm"

// This route will run as a cron job to clean up expired sessions
export async function GET() {
  try {
    // Get current timestamp
    const now = new Date()

    // Delete all sessions where expires is less than current time
    const result = await db.delete(sessions).where(lt(sessions.expires, now))

    return NextResponse.json({
      success: true,
      message: "Expired sessions cleaned up successfully",
    })
  } catch (error) {
    console.error("Error cleaning up sessions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clean up sessions",
      },
      { status: 500 }
    )
  }
}

// Mark this route as compatible with Edge runtime
export const runtime = "edge"
