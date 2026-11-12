import { Suspense } from "react"
import Image from "next/image"
import { cookies } from "next/headers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import AreaSelector from "@modules/layout/components/area-selector"
import SearchBox from "@modules/layout/components/search-box"
import { retrieveCustomer } from "@lib/data/customer"
import { getT } from "@lib/i18n/get-locale"
import { AREA_COOKIE } from "@lib/i18n/config"

export default async function Nav() {
  const { t, locale } = await getT()
  const area = (await cookies()).get(AREA_COOKIE)?.value ?? "wah"
  const customer = await retrieveCustomer()
  const areas = [
    { id: "wah", label: t("area.wah") },
    { id: "attock", label: t("area.attock") },
  ]
  const links = [
    { href: "/store", label: t("nav.shop") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/brands", label: t("nav.brands") },
    { href: "/build-my-pack", label: t("nav.buildPack") },
    { href: "/support", label: t("nav.support") },
  ]
  const util = "inline-flex min-h-11 items-center px-2 text-sm font-semibold text-bk-navy hover:underline"

  return (
    <header className="border-b border-bk-line bg-bk-cream lg:sticky lg:top-0 lg:z-40">
      <div className="border-b border-bk-line">
        <div className="mx-auto flex max-w-6xl items-center justify-end px-4">
          {customer ? (
            <LocalizedClientLink href="/account" className={util}>{t("nav.account")}</LocalizedClientLink>
          ) : (
            <>
              <LocalizedClientLink href="/sign-in" className={util}>{t("nav.signIn")}</LocalizedClientLink>
              <span aria-hidden="true" className="text-stone-400">|</span>
              <LocalizedClientLink href="/register" className={util}>{t("nav.register")}</LocalizedClientLink>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
        <LocalizedClientLink href="/" aria-label="Bachat Karo - home">
          <Image src="/brand/bachatkaro-logo.png" alt="Bachat Karo" width={831} height={163}
                 priority className="h-9 w-auto sm:h-10" />
        </LocalizedClientLink>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Suspense fallback={<span className="inline-block min-h-11 min-w-11" />}>
            <CartButton />
          </Suspense>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-2">
        <AreaSelector label={t("nav.deliverTo")} areas={areas} current={area} />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-2">
        <SearchBox
          placeholder={t("nav.search")}
          labels={{ label: t("search.label"), none: t("search.none"), seeAll: t("search.seeAll") }}
        />
      </div>
      <nav aria-label="Main" className="mx-auto max-w-6xl overflow-x-auto px-4 pb-2">
        <ul className="flex gap-2 whitespace-nowrap">
          {links.map((l) => (
            <li key={l.href}>
              <LocalizedClientLink href={l.href}
                className="inline-flex min-h-11 items-center rounded-full border border-bk-line bg-white px-4 text-sm font-semibold text-bk-navy">
                {l.label}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
