import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

const FIELDS =
  "*category_children,*parent_category,*parent_category.parent_category"

const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

// Compare handles ignoring case, "&"/"and" and punctuation differences
const norm = (s: string) =>
  safeDecode(s)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const listCategories = async (query?: Record<string, any>) => {
  const limit = query?.limit || 200
  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields: "*category_children,*products,*parent_category,*parent_category.parent_category",
          limit,
          ...query,
        },
        next: { revalidate: 60 },
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
    .catch(() => [] as HttpTypes.StoreProductCategory[])
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const raw = categoryHandle[categoryHandle.length - 1] ?? ""
  const handle = safeDecode(raw)

  // 1. direct lookup, with the handle safely encoded in the URL
  try {
    const url = `/store/product-categories?handle=${encodeURIComponent(handle)}&fields=${encodeURIComponent(FIELDS)}`
    const res = await sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>(url, { next: { revalidate: 60 }, cache: "force-cache" })
    if (res.product_categories?.length) return res.product_categories[0]
  } catch {}

  // 2. fallback: load all categories and match the handle loosely
  try {
    const res = await sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>(
      `/store/product-categories?limit=200&fields=${encodeURIComponent(FIELDS)}`,
      { next: { revalidate: 60 }, cache: "force-cache" }
    )
    const want = norm(handle)
    return res.product_categories.find((c) => norm(c.handle) === want)
  } catch {
    return undefined
  }
}
