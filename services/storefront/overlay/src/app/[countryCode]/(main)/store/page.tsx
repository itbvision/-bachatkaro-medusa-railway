import { Metadata } from "next"
import ProductCard from "@modules/products/components/product-card"
import PaginationLinks from "@modules/store/components/pagination-links"
import { listProducts } from "@lib/data/products"
import { getT } from "@lib/i18n/get-locale"

const PAGE_SIZE = 24

export const metadata: Metadata = { title: "All products | Bachat Karo Mart" }

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { countryCode } = await props.params
  const sp = await props.searchParams
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1)
  const { t } = await getT()

  const { response } = await listProducts({
    pageParam: page,
    countryCode,
    queryParams: { limit: PAGE_SIZE, order: "-created_at", fields: "*variants.calculated_price" },
  })
  const { products, count } = response
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const from = count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, count)

  return (
    <section className="bk-wrap py-6">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("store.title")}</h1>
      {count > 0 && (
        <p className="mt-1 text-sm text-stone-600">{t("store.showing", { from, to, total: count })}</p>
      )}
      {products.length === 0 ? (
        <p className="mt-4 text-stone-700">{t("store.empty")}</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} countryCode={countryCode} />
          ))}
        </div>
      )}
      <PaginationLinks
        page={page}
        totalPages={totalPages}
        basePath="/store"
        labels={{ prev: t("store.prev"), next: t("store.next"), page: t("store.page") }}
      />
    </section>
  )
}
