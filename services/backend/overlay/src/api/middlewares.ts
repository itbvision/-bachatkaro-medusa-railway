import {
  allowFields,
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { CreateCategoryImagesSchema } from "./admin/categories/[category_id]/images/route"
import {
  DeleteCategoryImagesSchema,
  UpdateCategoryImagesSchema,
} from "./admin/categories/[category_id]/images/batch/route"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/categories/:category_id/images",
      method: ["POST"],
      middlewares: [validateAndTransformBody(CreateCategoryImagesSchema)],
    },
    {
      matcher: "/admin/categories/:category_id/images/batch",
      method: ["POST"],
      middlewares: [validateAndTransformBody(UpdateCategoryImagesSchema)],
    },
    {
      matcher: "/admin/categories/:category_id/images/batch",
      method: ["DELETE"],
      middlewares: [validateAndTransformBody(DeleteCategoryImagesSchema)],
    },
    {
      // Global (no method) so the field is allowed before validation runs
      matcher: "/store/product-categories",
      middlewares: [allowFields("product_category_image")],
    },
  ],
})
