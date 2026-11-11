import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/get-locale"
import { getCategoryImagesMap } from "@lib/category-images"

export default async function CategoryRow({ categories }: { categories: HttpTypes.StoreProductCategory[] }) {
  const { t } = await getT()
  const images = await getCategoryImagesMap()
  return (
    <section className="mx-auto max-w-6xl px-4 pt-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-bk-navy">{t("home.categories")}</h2>
        <LocalizedClientLink href="/store" className="text-sm font-semibold text-bk-navy underline">
          {t("home.seeAll")}
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {categories.filter((c) => !c.parent_category_id).slice(0, 8).map((c) => {
          const thumb = images[c.id]?.find((i) => i.type === "thumbnail")
          return (
            <li key={c.id}>
              <LocalizedClientLink href={`/categories/${c.handle}`} className="flex flex-col items-center gap-1 py-1 text-center text-xs">
                {thumb ? (
                  <Image src={thumb.url} alt="" width={56} height={56} unoptimized
                         className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDE9C8] font-display text-lg font-bold text-bk-navy" aria-hidden="true">
                    {c.name.charAt(0)}
                  </span>
                )}
                {c.name}
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
