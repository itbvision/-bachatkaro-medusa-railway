import { Suspense } from "react"
import Image from "next/image"
import { cookies } from "next/headers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import AreaSelector from "@modules/layout/components/area-selector"
import { getT } from "@lib/i18n/get-locale"
import { AREA_COOKIE } from "@lib/i18n/config"

export default async function Nav() {
  const { t, locale } = await getT()
  const area = (await cookies()).get(AREA_COOKIE)?.value ?? "wah"
  const areas = [
    { id: "wah", label: t("area.wah") },
    { id: "attock", label: t("area.attock") },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-bk-line bg-bk-cream/95 backdrop-blur">
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
    </header>
  )
}
