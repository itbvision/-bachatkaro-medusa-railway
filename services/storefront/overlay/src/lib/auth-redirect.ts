// Only allow same-site relative paths after sign-in (prevents open redirects).
export const safeNext = (next?: string) =>
  next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") && !next.startsWith("/api")
    ? next
    : "/account"

export const CHECKOUT_NEXT = "/checkout?step=address"
export const GUEST_COOKIE = "bk_guest"
