import { HttpTypes } from "@medusajs/types"

// Medusa v2 returns amounts in major units (PKR, not paisa).
export function formatPKR(n: number, locale = "en") {
  return new Intl.NumberFormat(locale === "ur" ? "ur-PK-u-nu-latn" : "en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n)
}

// Needs the product fetched with fields: "*variants.calculated_price"
export function getPriceInfo(product: HttpTypes.StoreProduct, locale = "en") {
  const priced = (product.variants ?? []).filter(
    (v) => v.calculated_price?.calculated_amount != null
  )
  priced.sort(
    (a, b) => a.calculated_price!.calculated_amount! - b.calculated_price!.calculated_amount!
  )
  const variant = priced[0]
  if (!variant) return null
  const sale = variant.calculated_price!.calculated_amount!
  const orig = variant.calculated_price!.original_amount ?? sale
  const pct = orig > sale ? Math.round((1 - sale / orig) * 100) : 0
  return {
    variantId: variant.id,
    sale: formatPKR(sale, locale),
    original: pct ? formatPKR(orig, locale) : null,
    pct,
  }
}
