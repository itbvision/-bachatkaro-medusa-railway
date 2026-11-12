import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/get-locale"

export default async function Hero() {
  const { t } = await getT()
  return (
    <section className="bk-wrap mt-3">
      <div className="rounded-2xl bg-bk-navy p-5 text-white sm:p-8 lg:p-10">
        <p className="text-[11px] font-bold tracking-wider text-bk-amber sm:text-xs">{t("hero.badge")}</p>
        <h1 className="mt-1 max-w-3xl font-display text-xl font-bold sm:text-3xl lg:text-4xl">{t("hero.title")}</h1>
        <p lang="ur" dir="rtl" className="mt-1 text-right font-urdu text-base font-bold text-[#FFD58A] sm:text-lg">
          {t("hero.tagline")}
        </p>
        <LocalizedClientLink
          href="/build-my-pack"
          className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-bk-amber px-5 font-semibold text-bk-navy"
        >
          {t("hero.cta")}
        </LocalizedClientLink>
      </div>
    </section>
  )
}
