import { Metadata } from "next"
import ProductCard from "@modules/products/components/product-card"
import { searchProducts } from "@lib/search"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Search | Bachat Karo Mart" }

export default async function FindPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { countryCode } = await props.params
  const { q = "" } = await props.searchParams
  const { t } = await getT()
  const { products } = await searchProducts(q, countryCode, 40)

  return (
    <section className="bk-wrap py-6">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("search.resultsFor", { q })}</h1>
      {products.length === 0 ? (
        <p className="mt-4 text-stone-600">{t("search.none")}</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} countryCode={countryCode} />
          ))}
        </div>
      )}
    </section>
  )
}
