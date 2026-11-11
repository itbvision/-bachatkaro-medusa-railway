import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"

// Tries Meilisearch through Medusa's POST /store/search first and falls back to the
// built-in product text search, so the search box keeps working if the index is unavailable.
export async function searchProducts(q: string, countryCode: string, take = 8) {
  const term = q.trim().slice(0, 80)
  if (term.length < 2) {
    return { products: [] as HttpTypes.StoreProduct[], engine: "none" as const }
  }

  let ids: string[] = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      },
      body: JSON.stringify({ entity: "product", filters: { q: term }, pagination: { take } }),
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      const hits: Array<{ id?: string; document?: { id?: string } }> = data?.results?.[0]?.hits ?? []
      ids = hits.map((h) => h.id ?? h.document?.id).filter((x): x is string => Boolean(x))
    }
  } catch {
    // fall through to the fallback below
  }

  if (ids.length) {
    const { response } = await listProducts({
      countryCode,
      queryParams: { id: ids, limit: take, fields: "*variants.calculated_price" },
    })
    const byId = new Map(response.products.map((p) => [p.id, p]))
    const ordered = ids.map((id) => byId.get(id)).filter((p): p is HttpTypes.StoreProduct => Boolean(p))
    if (ordered.length) return { products: ordered, engine: "meilisearch" as const }
  }

  const { response } = await listProducts({
    countryCode,
    queryParams: { q: term, limit: take, fields: "*variants.calculated_price" },
  })
  return { products: response.products, engine: "fallback" as const }
}
