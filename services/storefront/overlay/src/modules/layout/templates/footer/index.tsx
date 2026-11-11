import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"
import { getT } from "@lib/i18n/get-locale"

export default async function Footer() {
  const { t } = await getT()
  const categories = ((await listCategories()) ?? []).filter((c) => !c.parent_category_id).slice(0, 8)
  const care = [
    { href: "/policies/terms", label: t("footer.terms") },
    { href: "/policies/privacy", label: t("footer.privacy") },
    { href: "/policies/shipping", label: t("footer.shipping") },
    { href: "/policies/returns", label: t("footer.returns") },
    { href: "/support", label: t("footer.support") },
  ]
  const link = "inline-flex min-h-11 items-center hover:underline"

  return (
    <footer className="mt-8 w-full border-t border-bk-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <LocalizedClientLink href="/" aria-label="Bachat Karo - home" className="self-start">
            <Image src="/brand/bachatkaro-logo.png" alt="Bachat Karo" width={831} height={163} className="h-10 w-auto" />
          </LocalizedClientLink>

          <nav aria-labelledby="footer-categories">
            <h2 id="footer-categories" className="font-display text-sm font-bold text-bk-navy">{t("footer.categories")}</h2>
            <ul className="mt-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink href={`/categories/${c.handle}`} className={link}>{c.name}</LocalizedClientLink>
                </li>
              ))}
              <li>
                <LocalizedClientLink href="/categories" className="inline-flex min-h-11 items-center font-semibold text-bk-navy underline">
                  {t("footer.viewAll")}
                </LocalizedClientLink>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-care">
            <h2 id="footer-care" className="font-display text-sm font-bold text-bk-navy">{t("footer.customerCare")}</h2>
            <ul className="mt-2 text-sm">
              {care.map((l) => (
                <li key={l.href}>
                  <LocalizedClientLink href={l.href} className={link}>{l.label}</LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-bk-line pt-4 text-xs text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} BachatKaro. {t("footer.rights")}</p>
          <p>
            {t("footer.poweredBy")}{" "}
            <a href="https://www.itbcommerce.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-bk-navy underline">
              ITB Commerce<span className="sr-only"> {t("footer.newTab")}</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
