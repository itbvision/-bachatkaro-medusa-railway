import { getT } from "@lib/i18n/get-locale"
import { formatPKR } from "@lib/util/price"

// threshold and subtotal in PKR (major units)
export default async function FreeDeliveryBar({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const { t, locale } = await getT()
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100))
  const remaining = Math.max(0, threshold - subtotal)
  return (
    <div className="rounded-2xl border border-bk-line bg-white p-3">
      <p className="text-sm font-semibold">
        {remaining > 0 ? t("cart.freeDelivery", { amount: formatPKR(remaining, locale) }) : "OK"}
      </p>
      <div role="progressbar" aria-label="Progress to free delivery" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
           className="mt-2 h-2 rounded bg-bk-line">
        <div className="h-2 rounded bg-bk-amber" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
