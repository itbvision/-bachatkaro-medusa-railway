import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getT } from "@lib/i18n/get-locale"
import { getPriceInfo } from "@lib/util/price"
import AddButton from "./add-button"

export default async function ProductCard({
  product, countryCode,
}: { product: HttpTypes.StoreProduct; countryCode: string }) {
  const { t, locale } = await getT()
  const price = getPriceInfo(product, locale)
  if (!price) return null
  // Optional: set metadata.unit_label (e.g. "PKR 450/kg") on products in Medusa admin
  const unit = product.metadata?.unit_label as string | undefined

  return (
    <article className="flex flex-col rounded-2xl border border-bk-line bg-white p-2">
      <LocalizedClientLink href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#FFF3E4]">
          {product.thumbnail && (
            <Image src={product.thumbnail} alt="" fill sizes="(max-width:640px) 45vw, 220px" className="object-cover" />
          )}
        </div>
        {price.pct > 0 && (
          <span className="mt-2 inline-block rounded-md bg-bk-amber px-1.5 py-0.5 text-[11px] font-bold text-bk-navy">
            {t("product.save", { pct: price.pct })}
          </span>
        )}
        <h3 className="mt-1 text-sm font-semibold leading-snug">{product.title}</h3>
        {unit && <p className="text-xs text-stone-600">{unit}</p>}
        <p className="mt-0.5">
          <span className="font-bold text-bk-sale">{price.sale}</span>{" "}
          {price.original && <s className="text-xs text-stone-500">{price.original}</s>}
        </p>
      </LocalizedClientLink>
      <AddButton variantId={price.variantId} countryCode={countryCode} label={t("product.add")} />
    </article>
  )
}
