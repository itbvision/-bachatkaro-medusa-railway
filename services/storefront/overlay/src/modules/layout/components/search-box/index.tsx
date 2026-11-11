"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Item = { id: string; title: string; handle: string; thumbnail: string | null; price: string | null }

export default function SearchBox({
  placeholder,
  labels,
}: {
  placeholder: string
  labels: { label: string; none: string; seeAll: string }
}) {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const [q, setQ] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [open, setOpen] = useState(false)
  const [searched, setSearched] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (q.trim().length < 2) {
      setItems([])
      setSearched(false)
      return
    }
    const ctl = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}&cc=${countryCode}`, { signal: ctl.signal })
        const d = await r.json()
        setItems(d.items ?? [])
        setSearched(true)
        setOpen(true)
      } catch {
        // aborted or offline: ignore
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      ctl.abort()
    }
  }, [q, countryCode])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim().length < 2) return
    setOpen(false)
    router.push(`/${countryCode}/find?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div ref={box} className="relative">
      <form role="search" onSubmit={submit}
            className="flex min-h-12 items-center gap-2 rounded-2xl border border-bk-line bg-white px-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#17396B" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => items.length > 0 && setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder={placeholder}
          aria-label={labels.label}
          autoComplete="off"
          className="min-h-11 flex-1 bg-transparent text-sm outline-none"
        />
      </form>
      {open && searched && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-96 overflow-auto rounded-2xl border border-bk-line bg-white p-2 shadow-lg">
          {items.length === 0 ? (
            <p className="p-3 text-sm text-stone-600">{labels.none}</p>
          ) : (
            <>
              <ul>
                {items.map((i) => (
                  <li key={i.id}>
                    <Link href={`/${countryCode}/products/${i.handle}`} onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center gap-3 rounded-xl p-2 hover:bg-bk-cream">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#FFF3E4]">
                        {i.thumbnail && <Image src={i.thumbnail} alt="" fill sizes="40px" unoptimized className="object-cover" />}
                      </span>
                      <span className="flex-1 text-sm font-semibold">{i.title}</span>
                      {i.price && <span className="text-sm font-bold text-bk-sale">{i.price}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/${countryCode}/find?q=${encodeURIComponent(q.trim())}`} onClick={() => setOpen(false)}
                    className="mt-1 flex min-h-11 items-center justify-center text-sm font-semibold text-bk-navy underline">
                {labels.seeAll}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
