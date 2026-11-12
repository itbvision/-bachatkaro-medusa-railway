import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import CategoryRow from "@modules/home/components/category-row"
import ProductCard from "@modules/products/components/product-card"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getCollectionByHandle } from "@lib/data/collections"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Bachat Karo Mart" }

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const { t } = await getT()
  const categories = await listCategories()
  const deals = await getCollectionByHandle("bachat-deals")
  const products = deals
    ? (await listProducts({
        countryCode,
        queryParams: { collection_id: [deals.id], limit: 8, fields: "*variants.calculated_price" },
      })).response.products
    : []

  return (
    <>
      <Hero />
      <CategoryRow categories={categories ?? []} countryCode={countryCode} />
      <section className="bk-wrap py-4">
        <h2 className="mb-2 font-display text-base font-bold text-bk-navy">{t("home.deals")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {products.map((p) => (<ProductCard key={p.id} product={p} countryCode={countryCode} />))}
        </div>
      </section>
    </>
  )
}
