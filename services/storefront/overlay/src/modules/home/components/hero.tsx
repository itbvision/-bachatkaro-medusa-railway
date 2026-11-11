import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/get-locale"

export default async function Hero() {
  const { t } = await getT()
  return (
    <section className="mx-4 mt-3 rounded-2xl bg-bk-navy p-5 text-white sm:mx-auto sm:max-w-6xl">
      <p className="text-[11px] font-bold tracking-wider text-bk-amber">{t("hero.badge")}</p>
      <h1 className="mt-1 font-display text-xl font-bold sm:text-3xl">{t("hero.title")}</h1>
      <p lang="ur" dir="rtl" className="mt-1 text-right font-urdu text-base font-bold text-[#FFD58A]">
        {t("hero.tagline")}
      </p>
      <LocalizedClientLink
        href="/collections/ration-pack"
        className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-bk-amber px-5 font-semibold text-bk-navy"
      >
        {t("hero.cta")}
      </LocalizedClientLink>
    </section>
  )
}
