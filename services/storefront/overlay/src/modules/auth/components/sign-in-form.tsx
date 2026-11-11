"use client"

import { useActionState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { login } from "@lib/data/customer"

const field = "min-h-12 w-full rounded-xl border border-bk-line bg-white px-3 text-base outline-none focus:border-bk-navy"

export default function SignInForm({ next, labels }: { next: string; labels: Record<string, string> }) {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const [message, formAction, isPending] = useActionState(login, null)
  const submitted = useRef(false)

  useEffect(() => {
    if (submitted.current && !isPending && !message) {
      router.push(`/${countryCode}${next}`)
      router.refresh()
    }
  }, [isPending, message, next, countryCode, router])

  return (
    <form action={formAction} onSubmit={() => { submitted.current = true }} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold">{labels.email}</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold">{labels.password}</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={field} />
      </div>
      {message && <p role="alert" className="text-sm text-bk-sale">{labels.error}</p>}
      <button type="submit" disabled={isPending}
              className="min-h-12 w-full rounded-xl bg-bk-navy px-5 font-semibold text-white disabled:opacity-60">
        {isPending ? labels.submitting : labels.submit}
      </button>
    </form>
  )
}
