import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/get-locale"

export default async function AllCategoriesLink() {
  const { t } = await getT()
  return (
    <nav aria-label="Breadcrumb" className="content-container mb-4 text-sm">
      <LocalizedClientLink href="/categories" className="inline-flex min-h-11 items-center font-semibold text-bk-navy underline">
        &larr; {t("categories.title")}
      </LocalizedClientLink>
    </nav>
  )
}
