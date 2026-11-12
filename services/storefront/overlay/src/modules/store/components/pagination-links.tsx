import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function PaginationLinks({
  page, totalPages, basePath, labels,
}: {
  page: number
  totalPages: number
  basePath: string
  labels: { prev: string; next: string; page: string }
}) {
  if (totalPages <= 1) return null

  const wanted = Array.from(new Set([1, page - 1, page, page + 1, totalPages]))
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b)
  const items: (number | "gap")[] = []
  wanted.forEach((n, i) => {
    if (i > 0 && n - wanted[i - 1] > 1) items.push("gap")
    items.push(n)
  })

  const box = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold"
  const link = `${box} border-bk-line bg-white text-bk-navy`
  const href = (n: number) => `${basePath}?page=${n}`

  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <LocalizedClientLink href={href(page - 1)} className={link} rel="prev">{labels.prev}</LocalizedClientLink>
      )}
      {items.map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-stone-500">&hellip;</span>
        ) : n === page ? (
          <span key={n} aria-current="page" aria-label={labels.page.replace("{n}", String(n))}
                className={`${box} border-bk-navy bg-bk-navy text-white`}>{n}</span>
        ) : (
          <LocalizedClientLink key={n} href={href(n)} aria-label={labels.page.replace("{n}", String(n))} className={link}>
            {n}
          </LocalizedClientLink>
        )
      )}
      {page < totalPages && (
        <LocalizedClientLink href={href(page + 1)} className={link} rel="next">{labels.next}</LocalizedClientLink>
      )}
    </nav>
  )
}
