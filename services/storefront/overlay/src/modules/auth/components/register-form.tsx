"use client"

import { useActionState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { signup } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const field = "min-h-12 w-full rounded-xl border border-bk-line bg-white px-3 text-base outline-none focus:border-bk-navy"

function Field(props: {
  id: string; label: string; type?: string; autoComplete?: string
  placeholder?: string; hint?: string; minLength?: number; required?: boolean; inputMode?: "tel" | "email" | "text"
}) {
  const { id, label, type = "text", hint, required = true, ...rest } = props
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{label}</label>
      <input id={id} name={id} type={type} required={required} aria-describedby={hint ? `${id}-hint` : undefined}
             className={field} {...rest} />
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-stone-600">{hint}</p>}
    </div>
  )
}

export default function RegisterForm({ next, labels }: { next: string; labels: Record<string, string> }) {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const [result, formAction, isPending] = useActionState(signup, null)
  const submitted = useRef(false)

  const ok = typeof result === "object" && result !== null
  const errorText =
    typeof result === "string" ? (/exist/i.test(result) ? labels.emailExists : labels.error) : null

  useEffect(() => {
    if (submitted.current && !isPending && ok) {
      router.push(`/${countryCode}${next}`)
      router.refresh()
    }
  }, [isPending, ok, next, countryCode, router])

  return (
    <form action={formAction} onSubmit={() => { submitted.current = true }} className="space-y-4">
      <Field id="first_name" label={labels.firstName} autoComplete="given-name" />
      <Field id="last_name" label={labels.lastName} autoComplete="family-name" />
      <Field id="email" label={labels.email} type="email" autoComplete="email" inputMode="email" />
      <Field id="phone" label={labels.phone} type="tel" autoComplete="tel" inputMode="tel" placeholder="03XX-XXXXXXX" />
      <Field id="password" label={labels.password} type="password" autoComplete="new-password" minLength={8} hint={labels.passwordHint} />

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" required className="mt-1 h-5 w-5" />
        <span>
          {labels.agree}{" "}
          <LocalizedClientLink href="/policies/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-bk-navy underline">
            {labels.terms}<span className="sr-only"> {labels.newTab}</span>
          </LocalizedClientLink>{" "}
          {labels.and}{" "}
          <LocalizedClientLink href="/policies/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-bk-navy underline">
            {labels.privacy}<span className="sr-only"> {labels.newTab}</span>
          </LocalizedClientLink>
        </span>
      </label>

      {errorText && <p role="alert" className="text-sm text-bk-sale">{errorText}</p>}
      <button type="submit" disabled={isPending}
              className="min-h-12 w-full rounded-xl bg-bk-navy px-5 font-semibold text-white disabled:opacity-60">
        {isPending ? labels.submitting : labels.submit}
      </button>
    </form>
  )
}
