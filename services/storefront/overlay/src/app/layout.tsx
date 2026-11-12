import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Inter, Montserrat, Noto_Naskh_Arabic } from "next/font/google"
import { getLocale } from "@lib/i18n/get-locale"
import { dirOf } from "@lib/i18n/config"
import "styles/globals.css"
import "styles/bachat.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const montserrat = Montserrat({
  subsets: ["latin"], variable: "--font-montserrat", display: "swap", weight: ["600", "700"],
})
const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"], variable: "--font-naskh", display: "swap", weight: ["500", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Bachat Karo Mart",
  description: "Save more on atta, rice, oil, ghee and daily groceries.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-mode="light"
      className={`${inter.variable} ${montserrat.variable} ${naskh.variable}`}
    >
      <body className={`bg-white text-stone-800 antialiased ${locale === "ur" ? "font-urdu" : "font-sans"}`}>
        <main className="relative">{children}</main>
      </body>
    </html>
  )
}
