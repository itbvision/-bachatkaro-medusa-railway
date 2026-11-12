import { Metadata } from "next"
import PackBuilder, { PackItem } from "@modules/pack/components/pack-builder"
import { getAllProducts } from "@lib/all-products"
import { getPriceInfo } from "@lib/util/price"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Build my monthly pack | Bachat Karo Mart" }

export default async function BuildMyPackPage(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const { t, locale } = await getT()
  const products = await getAllProducts(countryCode)

  // A product is part of the monthly pack when it has metadata.pack_qty (standard monthly quantity).
  const items: PackItem[] = products.flatMap((p) => {
    const base = Math.round(Number(p.metadata?.pack_qty))
    if (!Number.isFinite(base) || base <= 0) return []
    const info = getPriceInfo(p, locale)
    if (!info) return []
    const unit = p.metadata?.unit_label
    return [{
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail ?? null,
      variantId: info.variantId,
      unitPrice: info.saleAmount,
      unitLabel: typeof unit === "string" ? unit : undefined,
      baseQty: base,
    }]
  })

  return (
    <section className="bk-wrap py-6">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("pack.title")}</h1>
      <p className="mt-1 text-stone-700">{t("pack.intro")}</p>
      <div className="mt-4">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-bk-line bg-white p-4 text-stone-700">{t("pack.empty")}</p>
        ) : (
          <PackBuilder
            items={items}
            countryCode={countryCode}
            locale={locale}
            labels={{
              size: t("pack.size"), small: t("pack.small"), standard: t("pack.standard"), large: t("pack.large"),
              include: t("pack.include"), total: t("pack.total"), addAll: t("pack.addAll"),
              adding: t("pack.adding"), error: t("pack.error"),
            }}
          />
        )}
      </div>
    </section>
  )
}
