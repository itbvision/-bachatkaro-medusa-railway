import { Metadata } from "next"
import { redirect } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RegisterForm from "@modules/auth/components/register-form"
import { retrieveCustomer } from "@lib/data/customer"
import { safeNext } from "@lib/auth-redirect"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Create account | Bachat Karo Mart" }

export default async function RegisterPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ next?: string }>
}) {
  const { countryCode } = await props.params
  const next = safeNext((await props.searchParams).next)
  const { t } = await getT()
  if (await retrieveCustomer()) redirect(`/${countryCode}${next}`)

  return (
    <section className="mx-auto max-w-md px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("auth.registerTitle")}</h1>
      <div className="mt-4 rounded-2xl border border-bk-line bg-white p-4">
        <RegisterForm
          next={next}
          labels={{
            firstName: t("auth.firstName"), lastName: t("auth.lastName"), email: t("auth.email"),
            phone: t("auth.phone"), password: t("auth.password"), passwordHint: t("auth.passwordHint"),
            agree: t("auth.agree"), and: t("auth.and"), terms: t("footer.terms"), privacy: t("footer.privacy"),
            newTab: t("footer.newTab"), submit: t("auth.registerBtn"), submitting: t("auth.registering"),
            error: t("auth.registerError"), emailExists: t("auth.emailExists"),
          }}
        />
      </div>
      <p className="mt-4 text-sm">
        {t("auth.haveAccount")}{" "}
        <LocalizedClientLink href={`/sign-in?next=${encodeURIComponent(next)}`}
          className="inline-flex min-h-11 items-center font-semibold text-bk-navy underline">
          {t("auth.signInBtn")}
        </LocalizedClientLink>
      </p>
      {next.startsWith("/checkout") && (
        <p>
          <a href={`/api/guest-checkout?cc=${countryCode}`}
             className="inline-flex min-h-11 items-center text-sm font-semibold text-bk-navy underline">
            {t("auth.guestInstead")}
          </a>
        </p>
      )}
    </section>
  )
}
