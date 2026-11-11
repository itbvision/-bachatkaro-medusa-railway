import { SITE } from "./site-config"

export type PolicySection = { heading: string; body: string[] }
export type Policy = { title: string; sections: PolicySection[] }

const areas = SITE.areas.join(" and ")

export const POLICIES: Record<string, Policy> = {
  terms: {
    title: "Terms & Conditions",
    sections: [
      { heading: "About these terms", body: [`These terms apply to your use of the ${SITE.name} website and to every order you place with us. By using the site or placing an order you agree to them.`] },
      { heading: "Who we are", body: [`${SITE.name} is an online grocery store serving ${areas}. Our contact details are on the Customer Support page.`] },
      { heading: "Orders", body: ["An order is a request to buy. We accept it when we confirm it by phone, WhatsApp or SMS, or when we dispatch it.", "We may decline or cancel an order if an item is out of stock, a price or description is wrong, the address is outside our delivery areas, or we cannot reach you to confirm."] },
      { heading: "Prices and payment", body: ["Prices are in Pakistani Rupees (PKR) and may change without notice. You pay the price shown when you place your order, unless we correct an obvious error and give you the choice to continue or cancel.", "Payment is cash on delivery unless we announce other methods. Delivery charges and any applicable taxes are shown before you place the order."] },
      { heading: "Delivery, returns and refunds", body: ["Delivery is explained in our Shipping Policy. Returns and refunds are explained in our Returns & Refund Policy. Both form part of these terms."] },
      { heading: "Product information", body: ["We try to show accurate photos, pack sizes and descriptions. Manufacturers may change packaging or brands, and images are for illustration."] },
      { heading: "Your account and conduct", body: ["Keep your login details private. Please do not place false orders, misuse the site, or try to interfere with how it works."] },
      { heading: "Limitation of liability", body: ["To the extent allowed by law, we are not liable for indirect or consequential loss. Nothing in these terms limits any right you have under consumer protection laws that apply in Pakistan."] },
      { heading: "Changes to these terms", body: ["We may update these terms. The version on this page applies to orders placed after the update date."] },
      { heading: "Governing law", body: [`These terms are governed by the laws of Pakistan. Disputes are subject to the courts of ${SITE.city}.`] },
      { heading: "Contact", body: [`${SITE.name}, ${SITE.address}. Email ${SITE.email}, WhatsApp ${SITE.whatsapp}.`] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      { heading: "Introduction", body: [`This policy explains what personal information ${SITE.name} collects when you use our website and order from us, and how we use it.`] },
      { heading: "Information we collect", body: ["Your name, mobile number, email address (optional), delivery address and landmarks, your order history, and messages you send to our support team.", "Our website also stores small preferences in your browser, such as your language, your delivery area and your cart."] },
      { heading: "How we use your information", body: ["To confirm, prepare and deliver your orders; to contact you about them; to give customer support; to prevent fraud and misuse; and to improve our service."] },
      { heading: "Who we share it with", body: ["Only what is needed: delivery riders and couriers, payment providers (if you pay online), and the technology and hosting providers that run our site. We do not sell your personal information."] },
      { heading: "Cookies and similar technologies", body: ["We use essential storage for your language, delivery area and cart. If we add analytics or advertising tools in the future, we will update this policy first."] },
      { heading: "How long we keep it", body: ["We keep order records for as long as needed for service, accounting and legal requirements, then delete or anonymise them."] },
      { heading: "Your choices", body: [`You can ask to see, correct or delete your personal information, or stop marketing messages, by contacting us at ${SITE.email} or on WhatsApp ${SITE.whatsapp}.`] },
      { heading: "Security", body: ["We use reasonable technical and organisational measures to protect your information. No system is completely secure, so please keep your account details private."] },
      { heading: "Children", body: ["Our site is meant for adults. We do not knowingly collect information from children."] },
      { heading: "Changes and contact", body: [`We may update this policy and will show the date above. Questions? Contact ${SITE.email}.`] },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    sections: [
      { heading: "Where we deliver", body: [`We currently deliver in ${areas}. We will tell you if your address is outside our coverage.`] },
      { heading: "Delivery times", body: [`Orders placed before ${SITE.cutoff} are delivered the same day where possible. Other orders are delivered the next day. We will confirm an estimated time window by call or message.`] },
      { heading: "Charges", body: [`Delivery fee: ${SITE.deliveryFee}. Free delivery on orders of ${SITE.freeDeliveryFrom} or more. Minimum order: ${SITE.minOrder}.`] },
      { heading: "Order confirmation and tracking", body: [`We may call or message you on WhatsApp to confirm your order. For the status of an order, contact us with your order number: WhatsApp ${SITE.whatsapp}.`] },
      { heading: "Cash on delivery", body: ["Please keep the exact amount ready where possible. Our rider will hand you a receipt."] },
      { heading: "Receiving your order", body: ["Please check your items when they arrive and tell the rider about any problem straight away. See our Returns & Refund Policy for how to report an issue."] },
      { heading: "Missed deliveries", body: ["If our rider cannot reach you or nobody is at the address, we will try once more. Repeated failed deliveries may lead to the order being cancelled."] },
      { heading: "Delays", body: ["Weather, road closures or supply problems can delay an order. We will keep you informed."] },
    ],
  },
  returns: {
    title: "Returns & Refund Policy",
    sections: [
      { heading: "Our promise", body: ["If something is wrong with your order, tell us and we will put it right."] },
      { heading: "Tell us quickly", body: [`Please contact us within ${SITE.returnWindow} of delivery with your order number and a photo of the item and its packaging.`] },
      { heading: "What we cover", body: ["Damaged or leaking items, wrong items, missing items, expired or near-expiry items at delivery, and quality problems."] },
      { heading: "What we cannot accept", body: ["Change of mind on opened or perishable goods, items damaged after delivery through storage or handling, and claims made after the reporting period."] },
      { heading: "How we resolve it", body: ["We will replace the item, give you credit on your next order, or refund you. Where possible, you choose."] },
      { heading: "Refunds", body: [`For cash on delivery orders, a refund is given as cash adjusted at your next delivery, as store credit, or by bank or wallet transfer within ${SITE.refundDays} working days.`] },
      { heading: "Cancelling an order", body: ["You can cancel before dispatch at no charge by contacting us."] },
      { heading: "Contact", body: [`WhatsApp ${SITE.whatsapp} or email ${SITE.email}.`] },
    ],
  },
}
