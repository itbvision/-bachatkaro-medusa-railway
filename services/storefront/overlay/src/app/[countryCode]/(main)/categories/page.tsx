import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"
import { getCategoryImagesMap } from "@lib/category-images"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "All categories | Bachat Karo Mart" }

export default async function CategoriesPage() {
  const { t } = await getT()
  const [categories, images] = await Promise.all([listCategories(), getCategoryImagesMap()])
  const parents = (categories ?? []).filter((c) => !c.parent_category_id)

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("categories.title")}</h1>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {parents.map((c) => {
          const thumb = images[c.id]?.find((i) => i.type === "thumbnail")
          return (
            <li key={c.id}>
              <LocalizedClientLink
                href={`/categories/${c.handle}`}
                className="flex min-h-11 flex-col items-center gap-2 rounded-2xl border border-bk-line bg-white p-4 text-center hover:shadow-sm"
              >
                {thumb ? (
                  <Image src={thumb.url} alt="" width={96} height={96} unoptimized
                         className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true"
                        className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FDE9C8] font-display text-3xl font-bold text-bk-navy">
                    {c.name.charAt(0)}
                  </span>
                )}
                <span className="text-sm font-semibold">{c.name}</span>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
