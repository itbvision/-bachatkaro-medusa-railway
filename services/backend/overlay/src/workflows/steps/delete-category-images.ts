import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { PRODUCT_MEDIA_MODULE } from "../../modules/product-media"
import ProductMediaModuleService from "../../modules/product-media/service"

export type DeleteCategoryImagesStepInput = {
  ids: string[]
}

export const deleteCategoryImagesStep = createStep(
  "delete-category-images-step",
  async (input: DeleteCategoryImagesStepInput, { container }) => {
    const productMediaService: ProductMediaModuleService =
      container.resolve(PRODUCT_MEDIA_MODULE)

    const categoryImages = await productMediaService.listProductCategoryImages({
      id: input.ids,
    })

    await productMediaService.deleteProductCategoryImages(input.ids)

    return new StepResponse({ success: true, deleted: input.ids }, categoryImages)
  },
  async (categoryImages, { container }) => {
    if (!categoryImages || categoryImages.length === 0) {
      return
    }
    const productMediaService: ProductMediaModuleService =
      container.resolve(PRODUCT_MEDIA_MODULE)

    await productMediaService.createProductCategoryImages(
      categoryImages.map((c) => ({
        id: c.id,
        category_id: c.category_id,
        type: c.type,
        url: c.url,
        file_id: c.file_id,
      }))
    )
  }
)
