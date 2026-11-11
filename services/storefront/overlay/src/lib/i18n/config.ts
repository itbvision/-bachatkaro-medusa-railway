export const locales = ["en", "ur"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"
export const LOCALE_COOKIE = "bk_lang"
export const AREA_COOKIE = "bk_area"
export const dirOf = (l: Locale) => (l === "ur" ? "rtl" : "ltr")
