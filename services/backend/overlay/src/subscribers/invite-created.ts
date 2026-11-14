import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function inviteCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const userService = container.resolve(Modules.USER)
  const notificationService = container.resolve(Modules.NOTIFICATION)
  const logger = container.resolve("logger")

  try {
    const invite = await userService.retrieveInvite(data.id)
    const backend = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const adminPath = process.env.ADMIN_PATH || "/app"

    await notificationService.createNotifications({
      to: invite.email,
      channel: "email",
      template: "user-invited",
      data: { invite_url: `${backend}${adminPath}/invite?token=${invite.token}` },
    })
  } catch (e) {
    logger.error(`invite email failed: ${(e as Error).message}`)
  }
}

export const config: SubscriberConfig = { event: ["invite.created", "invite.resent"] }
