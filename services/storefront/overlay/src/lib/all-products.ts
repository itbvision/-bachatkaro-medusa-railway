import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"

// Fetches the catalogue page by page (100 per request). Fine up to a few hundred SKUs.
export async function getAllProducts(countryCode: string, max = 600) {
  const out: HttpTypes.StoreProduct[] = []
  let page = 1
  while (out.length < max) {
    const { response, nextPage } = await listProducts({
      pageParam: page,
      countryCode,
      queryParams: { limit: 100, fields: "*variants.calculated_price" },
    })
    out.push(...response.products)
    if (!nextPage) break
    page += 1
  }
  return out
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

export type BrandGroup = { name: string; slug: string; products: HttpTypes.StoreProduct[] }

// A product belongs to a brand when its metadata has a "brand" key (set in Medusa admin).
export function groupByBrand(products: HttpTypes.StoreProduct[]): BrandGroup[] {
  const map = new Map<string, BrandGroup>()
  for (const p of products) {
    const raw = p.metadata?.brand
    const name = typeof raw === "string" ? raw.trim() : ""
    if (!name) continue
    const slug = slugify(name)
    if (!slug) continue
    const group = map.get(slug) ?? { name, slug, products: [] }
    group.products.push(p)
    map.set(slug, group)
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}
