import Image from "next/image"
import { getCategoryImages } from "@lib/category-images"

export default async function CategoryBanner({
  categoryId,
  categoryName,
}: { categoryId: string; categoryName: string }) {
  const images = await getCategoryImages(categoryId)
  const banner = images.find((img) => img.type === "image")
  if (!banner) return null

  return (
    <div className="relative mb-8 h-40 w-full overflow-hidden sm:h-64 lg:h-80">
      <Image src={banner.url} alt={categoryName} fill priority unoptimized sizes="100vw" className="object-cover" />
    </div>
  )
}
