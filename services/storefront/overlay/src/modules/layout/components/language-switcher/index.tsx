"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { LOCALE_COOKIE, type Locale } from "@lib/i18n/config"

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [pending, start] = useTransition()

  const choose = (l: Locale) => {
    if (l === locale) return
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
    start(() => router.refresh())
  }

  return (
    <div role="group" aria-label="Language" className="inline-flex rounded-full border border-bk-line bg-white p-0.5">
      {(["en", "ur"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          disabled={pending}
          onClick={() => choose(l)}
          className={`min-h-11 min-w-11 rounded-full px-3 text-sm font-semibold ${
            locale === l ? "bg-bk-navy text-white" : "text-bk-navy"
          } ${l === "ur" ? "font-urdu" : ""}`}
        >
          {l === "en" ? "EN" : "اردو"}
        </button>
      ))}
    </div>
  )
}
