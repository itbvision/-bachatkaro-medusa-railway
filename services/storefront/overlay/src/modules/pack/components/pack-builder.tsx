"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { addToCart } from "@lib/data/cart"
import { formatPKR } from "@lib/util/price"

export type PackItem = {
  id: string
  title: string
  thumbnail: string | null
  variantId: string
  unitPrice: number
  unitLabel?: string
  baseQty: number
}

type Size = "small" | "standard" | "large"
const SCALE: Record<Size, number> = { small: 0.6, standard: 1, large: 1.5 }
const scaled = (base: number, size: Size) => Math.max(1, Math.round(base * SCALE[size]))
const initial = (items: PackItem[], size: Size) =>
  Object.fromEntries(items.map((i) => [i.id, scaled(i.baseQty, size)])) as Record<string, number>

export default function PackBuilder({
  items, countryCode, locale, labels,
}: {
  items: PackItem[]
  countryCode: string
  locale: string
  labels: Record<"size" | "small" | "standard" | "large" | "include" | "total" | "addAll" | "adding" | "error", string>
}) {
  const router = useRouter()
  const [size, setSize] = useState<Size>("standard")
  const [qty, setQty] = useState<Record<string, number>>(() => initial(items, "standard"))
  const [off, setOff] = useState<Set<string>>(new Set())
  const [failed, setFailed] = useState(false)
  const [pending, start] = useTransition()

  const total = useMemo(
    () => items.filter((i) => !off.has(i.id)).reduce((s, i) => s + i.unitPrice * (qty[i.id] ?? 0), 0),
    [items, off, qty]
  )

  const chooseSize = (s: Size) => {
    setSize(s)
    setQty(initial(items, s))
  }
  const change = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(1, (q[id] ?? 1) + delta) }))
  const toggle = (id: string) =>
    setOff((o) => {
      const n = new Set(o)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const addAll = () =>
    start(async () => {
      setFailed(false)
      try {
        for (const i of items) {
          if (off.has(i.id)) continue
          await addToCart({ variantId: i.variantId, quantity: qty[i.id] ?? 1, countryCode })
        }
        router.push(`/${countryCode}/cart`)
      } catch {
        setFailed(true)
      }
    })

  const step = "min-h-11 min-w-11 rounded-xl border border-bk-line bg-white text-bk-navy"

  return (
    <div>
      <div role="group" aria-label={labels.size} className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">{labels.size}</span>
        {(["small", "standard", "large"] as const).map((s) => (
          <button key={s} type="button" aria-pressed={size === s} onClick={() => chooseSize(s)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${
              size === s ? "border-bk-navy bg-bk-navy text-white" : "border-bk-line bg-white text-bk-navy"
            }`}>
            {labels[s]}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((i) => {
          const included = !off.has(i.id)
          return (
            <li key={i.id} className={`flex items-center gap-3 rounded-2xl border border-bk-line bg-white p-2 ${included ? "" : "opacity-50"}`}>
              <label className="flex min-h-11 min-w-11 items-center justify-center">
                <input type="checkbox" checked={included} onChange={() => toggle(i.id)}
                       aria-label={`${labels.include}: ${i.title}`} className="h-5 w-5" />
              </label>
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FFF3E4]">
                {i.thumbnail && <Image src={i.thumbnail} alt="" fill sizes="56px" unoptimized className="object-cover" />}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{i.title}</span>
                {i.unitLabel && <span className="block text-xs text-stone-600">{i.unitLabel}</span>}
                <span className="block text-sm font-bold text-bk-sale">{formatPKR(i.unitPrice, locale)}</span>
              </span>
              <span className="flex items-center gap-1">
                <button type="button" className={step} aria-label="Decrease" disabled={!included} onClick={() => change(i.id, -1)}>&minus;</button>
                <span className="min-w-7 text-center font-semibold">{qty[i.id]}</span>
                <button type="button" className={step} aria-label="Increase" disabled={!included} onClick={() => change(i.id, 1)}>+</button>
              </span>
            </li>
          )
        })}
      </ul>

      <div className="sticky bottom-0 mt-4 flex items-center justify-between gap-3 border-t border-bk-line bg-white p-3">
        <div>
          <div className="text-xs text-stone-600">{labels.total}</div>
          <div className="font-display text-lg font-bold text-bk-navy">{formatPKR(total, locale)}</div>
        </div>
        <button type="button" disabled={pending || total === 0} onClick={addAll}
                className="min-h-12 rounded-xl bg-bk-navy px-5 font-semibold text-white disabled:opacity-60">
          {pending ? labels.adding : labels.addAll}
        </button>
      </div>
      {failed && <p role="alert" className="mt-2 text-sm text-bk-sale">{labels.error}</p>}
    </div>
  )
}
