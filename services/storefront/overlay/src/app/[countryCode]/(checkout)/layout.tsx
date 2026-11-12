import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/get-locale"

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getT()
  return (
    <div className="relative w-full bg-white small:min-h-screen">
      <div className="h-16 border-b border-bk-line bg-white">
        <nav className="content-container flex h-full items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            data-testid="back-to-cart-link"
            className="flex min-h-11 flex-1 basis-0 items-center gap-x-2 text-sm font-semibold text-bk-navy"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            <span>{t("checkout.backToCart")}</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/" data-testid="store-link" aria-label="Bachat Karo - home">
            <Image src="/brand/bachatkaro-logo.png" alt="Bachat Karo" width={831} height={163} priority className="h-9 w-auto" />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <footer className="flex w-full flex-col items-center justify-center gap-1 border-t border-bk-line px-4 py-4 text-center text-xs text-stone-600 sm:flex-row sm:gap-2">
        <p>&copy; {new Date().getFullYear()} BachatKaro. {t("footer.rights")}</p>
        <p>
          {t("footer.poweredBy")}{" "}
          <a href="https://www.itbcommerce.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-bk-navy underline">
            ITB Commerce<span className="sr-only"> {t("footer.newTab")}</span>
          </a>
        </p>
      </footer>
    </div>
  )
}
