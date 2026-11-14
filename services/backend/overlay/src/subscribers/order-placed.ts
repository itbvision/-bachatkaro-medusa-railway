import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")

  try {
    const {
      data: [order],
    } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "subtotal",
        "shipping_total",
        "total",
        "items.title",
        "items.quantity",
        "items.total",
        "shipping_address.*",
      ],
      filters: { id: data.id },
    })

    if (!order?.email) {
      logger.warn(`order.placed: order ${data.id} has no email, skipping`)
      return
    }

    await notificationService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      data: {
        ...order,
        order_url: process.env.STOREFRONT_URL
          ? `${process.env.STOREFRONT_URL}/order/${order.id}`
          : undefined,
      },
    })
  } catch (e) {
    // never fail order placement because an email failed
    logger.error(`order.placed email failed: ${(e as Error).message}`)
  }
}

export const config: SubscriberConfig = { event: "order.placed" }
