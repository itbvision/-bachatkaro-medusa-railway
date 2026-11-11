import { NextRequest, NextResponse } from "next/server"
import { searchProducts } from "@lib/search"
import { getPriceInfo } from "@lib/util/price"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? ""
  const cc = (req.nextUrl.searchParams.get("cc") ?? "pk").slice(0, 2).toLowerCase()
  try {
    const { products, engine } = await searchProducts(q, cc, 6)
    return NextResponse.json({
      engine,
      items: products.map((p) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        thumbnail: p.thumbnail ?? null,
        price: getPriceInfo(p)?.sale ?? null,
      })),
    })
  } catch {
    return NextResponse.json({ engine: "error", items: [] })
  }
}
