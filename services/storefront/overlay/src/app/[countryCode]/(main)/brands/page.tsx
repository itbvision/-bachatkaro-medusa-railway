import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getAllProducts, groupByBrand } from "@lib/all-products"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Shop by brand | Bachat Karo Mart" }

export default async function BrandsPage(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const { t } = await getT()
  const brands = groupByBrand(await getAllProducts(countryCode))

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("brands.title")}</h1>
      {brands.length === 0 ? (
        <p className="mt-4 text-stone-600">{t("brands.empty")}</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((b) => {
            const img = b.products.find((p) => p.thumbnail)?.thumbnail
            return (
              <li key={b.slug}>
                <LocalizedClientLink href={`/brands/${b.slug}`}
                  className="flex min-h-11 flex-col items-center gap-2 rounded-2xl border border-bk-line bg-white p-4 text-center hover:shadow-sm">
                  {img ? (
                    <Image src={img} alt="" width={96} height={96} unoptimized className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FDE9C8] font-display text-3xl font-bold text-bk-navy">
                      {b.name.charAt(0)}
                    </span>
                  )}
                  <span className="text-sm font-semibold">{b.name}</span>
                  <span className="text-xs text-stone-600">{t("brands.items", { count: b.products.length })}</span>
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
