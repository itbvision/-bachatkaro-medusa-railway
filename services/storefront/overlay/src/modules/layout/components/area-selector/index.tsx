"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { AREA_COOKIE } from "@lib/i18n/config"

type Area = { id: string; label: string }

// Pass translated labels from the server nav. TODO: also map the area to the
// matching Medusa stock location / shipping options when you wire checkout.
export default function AreaSelector({
  label, areas, current,
}: { label: string; areas: Area[]; current: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()

  return (
    <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-bk-line bg-white px-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#17396B" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" />
      </svg>
      <span className="text-xs text-stone-600">{label}</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          document.cookie = `${AREA_COOKIE}=${e.target.value}; path=/; max-age=31536000; samesite=lax`
          start(() => router.refresh())
        }}
        className="min-h-11 flex-1 bg-transparent text-sm font-bold text-bk-navy outline-none"
      >
        {areas.map((a) => (<option key={a.id} value={a.id}>{a.label}</option>))}
      </select>
    </label>
  )
}
