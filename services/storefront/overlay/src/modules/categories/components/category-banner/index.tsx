import Image from "next/image"
import { getCategoryImages } from "@lib/category-images"

// Banner image (the non-thumbnail image set in Medusa admin -> category -> Media) with the category name on top.
export default async function CategoryBanner({
  categoryId,
  title,
  subtitle,
}: { categoryId: string; title: string; subtitle?: string }) {
  const images = await getCategoryImages(categoryId)
  const banner = images.find((img) => img.type === "image")

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-bk-navy sm:h-56 lg:h-72">
      {banner && (
        <Image src={banner.url} alt="" fill priority unoptimized sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 sm:p-6">
        <h1 className="font-display text-2xl font-bold text-white sm:text-4xl" data-testid="category-page-title">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-white/90">{subtitle}</p>}
      </div>
    </div>
  )
}
