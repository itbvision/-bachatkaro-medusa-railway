import { cookies } from "next/headers"
import { defaultLocale, LOCALE_COOKIE, locales, type Locale } from "./config"

export async function getLocale(): Promise<Locale> {
  const v = (await cookies()).get(LOCALE_COOKIE)?.value ?? ""
  return (locales as readonly string[]).includes(v) ? (v as Locale) : defaultLocale
}

export async function getT() {
  const locale = await getLocale()
  const dict = (await import(`./dictionaries/${locale}.json`)).default as Record<string, string>
  const t = (key: string, vars: Record<string, string | number> = {}) =>
    Object.entries(vars).reduce(
      (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
      dict[key] ?? key
    )
  return { locale, t }
}
