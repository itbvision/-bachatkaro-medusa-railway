import { Metadata } from "next"
import { redirect } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { retrieveCustomer } from "@lib/data/customer"
import { CHECKOUT_NEXT } from "@lib/auth-redirect"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Checkout | Bachat Karo Mart" }

export default async function CheckoutOptions(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const { t } = await getT()
  if (await retrieveCustomer()) redirect(`/${countryCode}${CHECKOUT_NEXT}`)

  const next = encodeURIComponent(CHECKOUT_NEXT)
  const card = "flex min-h-11 flex-col gap-1 rounded-2xl border border-bk-line bg-white p-4"

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <LocalizedClientLink href="/cart" className="inline-flex min-h-11 items-center text-sm font-semibold text-bk-navy underline">
        &larr; {t("checkout.backToCart")}
      </LocalizedClientLink>
      <h1 className="mt-2 font-display text-2xl font-bold text-bk-navy">{t("checkout.title")}</h1>

      <div className="mt-4 space-y-3">
        <a href={`/api/guest-checkout?cc=${countryCode}`}
           className="flex min-h-14 flex-col justify-center rounded-2xl bg-bk-navy p-4 text-white">
          <span className="text-base font-bold">{t("auth.guestInstead")}</span>
          <span className="text-sm text-white/90">{t("checkout.guestHint")}</span>
        </a>
        <LocalizedClientLink href={`/sign-in?next=${next}`} className={card}>
          <span className="text-base font-bold text-bk-navy">{t("auth.signInBtn")}</span>
          <span className="text-sm text-stone-700">{t("checkout.signInHint")}</span>
        </LocalizedClientLink>
        <LocalizedClientLink href={`/register?next=${next}`} className={card}>
          <span className="text-base font-bold text-bk-navy">{t("auth.registerBtn")}</span>
          <span className="text-sm text-stone-700">{t("checkout.registerHint")}</span>
        </LocalizedClientLink>
      </div>
    </section>
  )
}
