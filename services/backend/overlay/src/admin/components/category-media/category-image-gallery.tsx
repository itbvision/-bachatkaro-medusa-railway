import { Text } from "@medusajs/ui"
import { CategoryImage, UploadedFile } from "../../types"
import { CategoryImageItem } from "./category-image-item"

type CategoryImageGalleryProps = {
  existingImages: CategoryImage[]
  uploadedFiles: UploadedFile[]
  currentThumbnailId: string | null
  selectedImageIds: Set<string>
  onToggleSelect: (id: string, isUploaded?: boolean) => void
  imagesToDelete: Set<string>
}

export const CategoryImageGallery = ({
  existingImages,
  uploadedFiles,
  currentThumbnailId,
  selectedImageIds,
  onToggleSelect,
  imagesToDelete,
}: CategoryImageGalleryProps) => {
  const visibleExistingImages = existingImages.filter(
    (image) => image.id && !imagesToDelete.has(image.id)
  )
  const hasNoImages = visibleExistingImages.length === 0 && uploadedFiles.length === 0

  return (
    <div className="bg-ui-bg-subtle size-full overflow-auto">
      <div className="grid h-fit auto-rows-auto grid-cols-4 gap-6 p-6">
        {visibleExistingImages.map((image) => {
          if (!image.id) {
            return null
          }
          const imageId = image.id
          return (
            <CategoryImageItem
              key={imageId}
              id={imageId}
              url={image.url}
              alt={`Category ${image.type}`}
              isThumbnail={currentThumbnailId === imageId}
              isSelected={selectedImageIds.has(imageId)}
              onToggleSelect={() => onToggleSelect(imageId)}
            />
          )
        })}
        {uploadedFiles.map((file) => {
          const uploadedId = `uploaded:${file.id}`
          return (
            <CategoryImageItem
              key={file.id}
              id={file.id}
              url={file.url}
              alt="Uploaded"
              isThumbnail={currentThumbnailId === uploadedId}
              isSelected={selectedImageIds.has(uploadedId)}
              onToggleSelect={() => onToggleSelect(file.id, true)}
            />
          )
        })}
        {hasNoImages && (
          <div className="col-span-4 flex items-center justify-center p-8">
            <Text className="text-ui-fg-subtle text-center">
              No images yet. Upload images to get started.
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
