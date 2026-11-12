import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "@modules/products/components/product-card"
import { getAllProducts, groupByBrand } from "@lib/all-products"
import { getT } from "@lib/i18n/get-locale"

export default async function BrandPage(props: { params: Promise<{ countryCode: string; brand: string }> }) {
  const { countryCode, brand } = await props.params
  const { t } = await getT()
  const group = groupByBrand(await getAllProducts(countryCode)).find((b) => b.slug === brand)
  if (!group) notFound()

  return (
    <section className="bk-wrap py-6">
      <LocalizedClientLink href="/brands" className="inline-flex min-h-11 items-center text-sm font-semibold text-bk-navy underline">
        &larr; {t("brands.all")}
      </LocalizedClientLink>
      <h1 className="mt-2 font-display text-2xl font-bold text-bk-navy">{group.name}</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {group.products.map((p) => (
          <ProductCard key={p.id} product={p} countryCode={countryCode} />
        ))}
      </div>
    </section>
  )
}
