import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { GUEST_COOKIE } from "@lib/auth-redirect"

// Shoppers must pick "sign in", "register" or "continue as guest" before checkout.
export default async function CheckoutGate({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await retrieveCustomer()
  const isGuest = (await cookies()).get(GUEST_COOKIE)?.value === "1"
  if (!customer && !isGuest) redirect(`/${countryCode}/checkout-options`)
  return <>{children}</>
}
