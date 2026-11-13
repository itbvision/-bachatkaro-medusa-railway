import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "@modules/products/components/product-card"
import PaginationLinks from "@modules/store/components/pagination-links"
import CategoryBanner from "@modules/categories/components/category-banner"
import { listProducts } from "@lib/data/products"
import { getT } from "@lib/i18n/get-locale"

const PAGE_SIZE = 24

export default async function CategoryTemplate({
  category,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: string
  page?: string
  countryCode: string
}) {
  if (!category || !countryCode) notFound()
  const { t } = await getT()
  const pageNumber = Math.max(1, parseInt(page ?? "1", 10) || 1)

  const parents: HttpTypes.StoreProductCategory[] = []
  let up: HttpTypes.StoreProductCategory | null | undefined = category.parent_category
  while (up) {
    parents.unshift(up)
    up = up.parent_category
  }
  const basePath = `/categories/${[...parents, category].map((c) => c.handle).join("/")}`

  // Products of this category and of its direct sub-categories
  const ids = [category.id, ...(category.category_children ?? []).map((c) => c.id)]
  const { response } = await listProducts({
    pageParam: pageNumber,
    countryCode,
    queryParams: { category_id: ids, limit: PAGE_SIZE, order: "-created_at", fields: "*variants.calculated_price" },
  })
  const { products, count } = response
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const from = count === 0 ? 0 : (pageNumber - 1) * PAGE_SIZE + 1
  const to = Math.min(pageNumber * PAGE_SIZE, count)
  const countText = count === 1 ? t("categories.count1") : t("categories.count", { count })
  const children = category.category_children ?? []
  const crumb = "inline-flex min-h-11 items-center font-semibold text-bk-navy underline"

  return (
    <div className="bk-wrap py-4" data-testid="category-container">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 text-sm">
          <li>
            <LocalizedClientLink href="/categories" className={crumb}>{t("categories.title")}</LocalizedClientLink>
          </li>
          {parents.map((p) => (
            <li key={p.id} className="flex items-center gap-x-2">
              <span aria-hidden="true">/</span>
              <LocalizedClientLink href={`/categories/${p.handle}`} className={crumb}>{p.name}</LocalizedClientLink>
            </li>
          ))}
          <li className="flex items-center gap-x-2">
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-stone-700">{category.name}</span>
          </li>
        </ol>
      </nav>

      <div className="mt-2">
        <CategoryBanner categoryId={category.id} title={category.name} subtitle={countText} />
      </div>

      {category.description && <p className="mt-4 max-w-3xl text-stone-700">{category.description}</p>}

      {children.length > 0 && (
        <nav aria-label={t("categories.title")} className="mt-4 overflow-x-auto">
          <ul className="flex gap-2 whitespace-nowrap">
            {children.map((c) => (
              <li key={c.id}>
                <LocalizedClientLink
                  href={`${basePath}/${c.handle}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-bk-line bg-white px-4 text-sm font-semibold text-bk-navy"
                >
                  {c.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {count > 0 && (
        <p className="mt-4 text-sm text-stone-600">{t("store.showing", { from, to, total: count })}</p>
      )}

      {products.length === 0 ? (
        <p className="mt-4 text-stone-700">{t("store.empty")}</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} countryCode={countryCode} />
          ))}
        </div>
      )}

      <PaginationLinks
        page={pageNumber}
        totalPages={totalPages}
        basePath={basePath}
        labels={{ prev: t("store.prev"), next: t("store.next"), page: t("store.page") }}
      />
    </div>
  )
}
