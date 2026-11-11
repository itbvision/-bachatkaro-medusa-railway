import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { CategoryImage } from "../types"

type Props = {
  categoryId: string
  onCreateSuccess?: () => void
  onUpdateSuccess?: () => void
  onDeleteSuccess?: (deletedIds: string[]) => void
}

export const useCategoryImageMutations = ({
  categoryId,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: Props) => {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["category-images", categoryId] })

  const uploadFilesMutation = useMutation({
    mutationFn: async (files: File[]) => sdk.admin.upload.create({ files }),
    onError: (error) => console.error("Failed to upload files:", error),
  })

  const createImagesMutation = useMutation({
    mutationFn: async (images: Omit<CategoryImage, "id" | "category_id">[]) =>
      sdk.client.fetch(`/admin/categories/${categoryId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { images },
      }),
    onSuccess: () => {
      invalidate()
      onCreateSuccess?.()
    },
  })

  const updateImagesMutation = useMutation({
    mutationFn: async (updates: { id: string; type: "thumbnail" | "image" }[]) =>
      sdk.client.fetch(`/admin/categories/${categoryId}/images/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { updates },
      }),
    onSuccess: () => {
      invalidate()
      onUpdateSuccess?.()
    },
  })

  const deleteImagesMutation = useMutation({
    mutationFn: async (ids: string[]) =>
      sdk.client.fetch(`/admin/categories/${categoryId}/images/batch`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: { ids },
      }),
    onSuccess: (_data, deletedIds) => {
      invalidate()
      onDeleteSuccess?.(deletedIds)
    },
  })

  return {
    uploadFilesMutation,
    createImagesMutation,
    updateImagesMutation,
    deleteImagesMutation,
  }
}
