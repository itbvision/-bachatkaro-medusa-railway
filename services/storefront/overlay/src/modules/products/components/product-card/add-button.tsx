"use client"

import { useState, useTransition } from "react"
import { addToCart } from "@lib/data/cart"

export default function AddButton({
  variantId, countryCode, label,
}: { variantId: string; countryCode: string; label: string }) {
  const [qty, setQty] = useState(1)
  const [pending, start] = useTransition()
  const step = "min-h-11 min-w-11 rounded-xl border border-bk-line bg-white text-bk-navy"

  return (
    <div className="mt-2 flex items-center gap-1">
      <button type="button" className={step} aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))}>&minus;</button>
      <span className="min-w-7 text-center font-semibold">{qty}</span>
      <button type="button" className={step} aria-label="Increase" onClick={() => setQty((q) => q + 1)}>+</button>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => { await addToCart({ variantId, quantity: qty, countryCode }) })}
        className="min-h-11 flex-1 rounded-xl bg-bk-navy px-3 font-semibold text-white disabled:opacity-60"
      >
        {label}
      </button>
    </div>
  )
}
