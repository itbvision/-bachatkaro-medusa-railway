import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"

// Number of products in each category (own products + its direct sub-categories).
export async function getCategoryCounts(
  countryCode: string,
  categories: HttpTypes.StoreProductCategory[]
) {
  const entries = await Promise.all(
    categories.map(async (c) => {
      const ids = [c.id, ...(c.category_children ?? []).map((x) => x.id)]
      try {
        const { response } = await listProducts({
          countryCode,
          queryParams: { category_id: ids, limit: 1, fields: "id" },
        })
        return [c.id, response.count] as const
      } catch {
        return [c.id, 0] as const
      }
    })
  )
  return Object.fromEntries(entries) as Record<string, number>
}
