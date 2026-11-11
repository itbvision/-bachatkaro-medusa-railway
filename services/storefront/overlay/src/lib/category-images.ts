// Reads category images from the custom `product_category_image` link added in the backend.
// Uses plain fetch so no upstream storefront data file has to be edited.
export type CategoryImage = {
  id?: string
  url: string
  type: "thumbnail" | "image"
  category_id?: string
}

async function fetchImages(qs: string): Promise<Record<string, CategoryImage[]>> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories?${qs}`,
      {
        headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "" },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return {}
    const data = await res.json()
    const out: Record<string, CategoryImage[]> = {}
    for (const c of data.product_categories ?? []) {
      out[c.id] = c.product_category_image ?? []
    }
    return out
  } catch {
    return {}
  }
}

const FIELDS = `fields=${encodeURIComponent("id,*product_category_image")}`

export const getCategoryImagesMap = () => fetchImages(`${FIELDS}&limit=100`)

export async function getCategoryImages(categoryId: string): Promise<CategoryImage[]> {
  const map = await fetchImages(`id=${encodeURIComponent(categoryId)}&${FIELDS}`)
  return map[categoryId] ?? []
}
