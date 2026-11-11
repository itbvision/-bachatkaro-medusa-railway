import { Metadata } from "next"
import { redirect } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SignInForm from "@modules/auth/components/sign-in-form"
import { retrieveCustomer } from "@lib/data/customer"
import { safeNext } from "@lib/auth-redirect"
import { getT } from "@lib/i18n/get-locale"

export const metadata: Metadata = { title: "Sign in | Bachat Karo Mart" }

export default async function SignInPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ next?: string }>
}) {
  const { countryCode } = await props.params
  const next = safeNext((await props.searchParams).next)
  const { t } = await getT()
  if (await retrieveCustomer()) redirect(`/${countryCode}${next}`)

  return (
    <section className="mx-auto max-w-md px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{t("auth.signInTitle")}</h1>
      <div className="mt-4 rounded-2xl border border-bk-line bg-white p-4">
        <SignInForm
          next={next}
          labels={{
            email: t("auth.email"), password: t("auth.password"), submit: t("auth.signInBtn"),
            submitting: t("auth.signingIn"), error: t("auth.signInError"),
          }}
        />
      </div>
      <p className="mt-4 text-sm">
        {t("auth.noAccount")}{" "}
        <LocalizedClientLink href={`/register?next=${encodeURIComponent(next)}`}
          className="inline-flex min-h-11 items-center font-semibold text-bk-navy underline">
          {t("auth.registerBtn")}
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
