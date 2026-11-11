import { Metadata } from "next"
import { SITE } from "@lib/site-config"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Customer Support | Bachat Karo Mart" }

const FAQ: { q: string; a: string }[] = [
  { q: "How do I place an order?", a: "Add items to your cart, go to checkout, enter your address and phone number, and choose cash on delivery. We will confirm by call or WhatsApp." },
  { q: "Do you deliver to my area?", a: `We currently deliver in ${SITE.areas.join(" and ")}. Choose your area at the top of the page.` },
  { q: "How do I pay?", a: "Cash on delivery. Other payment methods will be announced here when they are available." },
  { q: "Can I change or cancel my order?", a: "Yes, before it is dispatched. Message us on WhatsApp with your order number." },
  { q: "What if an item is damaged or wrong?", a: `Tell us within ${SITE.returnWindow} of delivery with a photo. See our Returns & Refund Policy.` },
  { q: "How do I track my order?", a: "Message us with your order number and we will tell you the status." },
]

export default async function SupportPage() {
  const { t } = await getT()
  const contacts = [
    { label: t("support.whatsapp"), value: SITE.whatsapp },
    { label: t("support.phone"), value: SITE.phone },
    { label: t("support.email"), value: SITE.email },
    { label: t("support.hours"), value: SITE.hours },
  ]

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("support.title")}</h1>
      <p className="mt-1 text-stone-700">{t("support.intro")}</p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {contacts.map((c) => (
          <div key={c.label} className="rounded-2xl border border-bk-line bg-white p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">{c.label}</dt>
            <dd className="mt-1 font-semibold text-bk-navy" dir="ltr">{c.value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-8 font-display text-lg font-bold text-bk-navy">{t("support.faq")}</h2>
      <div lang="en" dir="ltr" className="mt-2 space-y-2">
        {FAQ.map((f) => (
          <details key={f.q} className="rounded-2xl border border-bk-line bg-white p-3">
            <summary className="min-h-11 cursor-pointer py-2 font-semibold">{f.q}</summary>
            <p className="pb-2 text-stone-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
