import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import type {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { Resend } from "resend"

type ResendOptions = {
  api_key: string
  from: string
  reply_to?: string
  store_name?: string
}

type InjectedDependencies = {
  logger: Logger
}

type Data = Record<string, unknown>

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

// Only allow http(s) links inside emails
const safeUrl = (value: unknown) => {
  const url = typeof value === "string" ? value : ""
  return /^https?:\/\//i.test(url) ? escapeHtml(url) : null
}

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"

  private resendClient: Resend
  private options: ResendOptions
  private logger: Logger

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super()
    ResendNotificationProviderService.validateOptions(options)
    this.resendClient = new Resend(options.api_key)
    this.options = options
    this.logger = logger
  }

  static validateOptions(options: Record<string, unknown>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `api_key` is required for Resend provider."
      )
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `from` is required for Resend provider."
      )
    }
  }

  private get storeName() {
    return this.options.store_name || "BachatKaro"
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    if (!notification.template) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Notification template is required."
      )
    }

    const to = Array.isArray(notification.to)
      ? notification.to
      : [notification.to]

    const data: Data =
      notification.data && typeof notification.data === "object"
        ? (notification.data as Data)
        : {}

    const subject =
      typeof data.subject === "string"
        ? data.subject
        : this.getTemplateSubject(notification.template, data)

    // Caller-supplied raw HTML wins; otherwise render a built-in template.
    const html =
      typeof data.html === "string"
        ? data.html
        : typeof data.content === "string"
          ? data.content
          : this.renderTemplate(notification.template, data)

    const { data: sent, error } = await this.resendClient.emails.send({
      from: this.options.from,
      to,
      subject,
      html,
      ...(this.options.reply_to ? { replyTo: this.options.reply_to } : {}),
    })

    if (error) {
      this.logger.error(`Resend email failed: ${error.message}`)
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, error.message)
    }

    this.logger.info(
      `Resend email "${notification.template}" sent: ${sent?.id ?? "unknown"}`
    )

    return { id: sent?.id ?? "" }
  }

  private getTemplateSubject(template: string, data: Data) {
    switch (template) {
      case "order-placed":
        return `Your ${this.storeName} order #${data.display_id ?? ""} is confirmed`
      case "user-invited":
        return `You've been invited to join ${this.storeName}`
      case "email-verification":
        return `Verify your ${this.storeName} email`
      case "password-reset":
        return `Reset your ${this.storeName} password`
      case "customer-welcome":
        return `Welcome to ${this.storeName}`
      default:
        return `${this.storeName} Notification`
    }
  }

  private layout(title: string, body: string) {
    return `<!doctype html>
<html>
  <body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;">
      <h1 style="margin-top:0;font-size:22px;">${escapeHtml(title)}</h1>
      ${body}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 12px;" />
      <p style="color:#6b7280;font-size:12px;">${escapeHtml(this.storeName)}</p>
    </div>
  </body>
</html>`
  }

  private button(url: string, label: string) {
    return `<p><a href="${url}" style="display:inline-block;padding:12px 20px;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:6px;">${escapeHtml(label)}</a></p>`
  }

  private money(amount: unknown, currency: unknown) {
    const n = Number(amount ?? 0)
    try {
      return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: String(currency || "PKR").toUpperCase(),
      }).format(n)
    } catch {
      return `${currency ?? ""} ${n.toFixed(2)}`
    }
  }

  private renderTemplate(template: string, data: Data) {
    const fallback = this.layout(
      this.storeName,
      `<p>You have received a notification from ${escapeHtml(this.storeName)}.</p>`
    )

    switch (template) {
      case "order-placed": {
        const items = Array.isArray(data.items) ? (data.items as Data[]) : []
        const cur = data.currency_code
        const rows = items
          .map(
            (i) => `<tr>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">${escapeHtml(i.title)}</td>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:center;">${escapeHtml(i.quantity)}</td>
              <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;">${this.money(i.total, cur)}</td>
            </tr>`
          )
          .join("")
        const addr = (data.shipping_address ?? {}) as Data
        const addrLine = [addr.address_1, addr.address_2, addr.city, addr.province, addr.postal_code]
          .filter(Boolean)
          .map(escapeHtml)
          .join(", ")
        const trackUrl = safeUrl(data.order_url)

        return this.layout(
          "Thanks for your order!",
          `<p>Your order <strong>#${escapeHtml(data.display_id)}</strong> has been received.</p>
           <table style="width:100%;border-collapse:collapse;font-size:14px;">
             <thead><tr>
               <th align="left">Item</th><th>Qty</th><th align="right">Total</th>
             </tr></thead>
             <tbody>${rows}</tbody>
           </table>
           <p style="text-align:right;font-size:14px;">
             Subtotal: ${this.money(data.subtotal, cur)}<br/>
             Shipping: ${this.money(data.shipping_total, cur)}<br/>
             <strong>Total: ${this.money(data.total, cur)}</strong>
           </p>
           ${addrLine ? `<p style="font-size:14px;"><strong>Delivering to:</strong> ${addrLine}</p>` : ""}
           ${trackUrl ? this.button(trackUrl, "View order") : ""}`
        )
      }

      case "user-invited": {
        const url = safeUrl(data.invite_url)
        if (!url) return fallback
        return this.layout(
          `Welcome to ${this.storeName}`,
          `<p>You have been invited to access the ${escapeHtml(this.storeName)} admin portal.</p>
           ${this.button(url, "Accept Invitation")}
           <p style="color:#6b7280;font-size:13px;">If you were not expecting this, ignore this email.</p>`
        )
      }

      case "password-reset": {
        const url = safeUrl(data.reset_url)
        if (!url) return fallback
        return this.layout(
          `Reset your ${this.storeName} password`,
          `<p>Click the button below to reset your password. The link expires soon.</p>
           ${this.button(url, "Reset Password")}
           <p style="color:#6b7280;font-size:13px;">If you didn't request this, ignore this email.</p>`
        )
      }

      case "email-verification": {
        const url = safeUrl(data.verification_url)
        if (!url) return fallback
        return this.layout(
          `Verify your ${this.storeName} email`,
          `<p>Click the button below to verify your email address.</p>${this.button(url, "Verify Email")}`
        )
      }

      case "customer-welcome":
        return this.layout(
          `Welcome to ${this.storeName}`,
          `<p>Hi ${escapeHtml(data.first_name || "there")}, thanks for creating an account. Happy shopping!</p>`
        )

      default:
        return fallback
    }
  }
}

export default ResendNotificationProviderService
