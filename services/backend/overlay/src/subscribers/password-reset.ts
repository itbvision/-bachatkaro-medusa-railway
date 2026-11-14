import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function resetPasswordHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; actor_type: string; token: string }>) {
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")

  const { entity_id: email, actor_type, token } = data

  const base =
    actor_type === "customer"
      ? process.env.STOREFRONT_URL || "http://localhost:8000"
      : `${process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}${
          process.env.ADMIN_PATH || "/app"
        }`

  const reset_url = `${base}/reset-password?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(email)}`

  try {
    await notificationService.createNotifications({
      to: email,
      channel: "email",
      template: "password-reset",
      data: { reset_url },
    })
  } catch (e) {
    logger.error(`password reset email failed: ${(e as Error).message}`)
  }
}

export const config: SubscriberConfig = { event: "auth.password_reset" }
