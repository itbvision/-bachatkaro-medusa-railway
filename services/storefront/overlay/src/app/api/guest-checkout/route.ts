import { NextRequest, NextResponse } from "next/server"
import { GUEST_COOKIE } from "@lib/auth-redirect"

export const dynamic = "force-dynamic"

// "Continue as guest": remember the choice, then go to checkout (relative redirect, proxy-safe).
export async function GET(req: NextRequest) {
  const cc = (req.nextUrl.searchParams.get("cc") ?? "pk").replace(/[^a-z]/gi, "").slice(0, 2).toLowerCase() || "pk"
  const res = new NextResponse(null, {
    status: 302,
    headers: { Location: `/${cc}/checkout?step=address` },
  })
  res.cookies.set(GUEST_COOKIE, "1", {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  return res
}
