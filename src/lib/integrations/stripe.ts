import crypto from "node:crypto";

/**
 * Dual-Mode Stripe Checkout & Webhook Verification Helper.
 *
 * - When `STRIPE_SECRET_KEY` is configured in Railway / environment variables
 *   and the payable amount after coupon discount is > 0, creates a live Stripe
 *   Checkout Session via `https://api.stripe.com/v1/checkout/sessions`.
 * - When `STRIPE_SECRET_KEY` is not yet configured (or when a 100% coupon like
 *   `EARLY100` reduces the price to £0.00), the platform fulfills the order
 *   immediately in-app.
 */

export function isLiveStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key && key.startsWith("sk_"));
}

export async function createStripeCheckoutSession(params: {
  productId: string;
  productName: string;
  isSubscription: boolean;
  amountPence: number;
  buyerEmail: string;
  beneficiaryStudentId: string;
  buyerUserId: string;
  couponCode?: string;
  originUrl: string;
}): Promise<{ checkoutUrl?: string; sessionId?: string }> {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey || params.amountPence <= 0) {
    return {};
  }

  const form = new URLSearchParams();
  form.append("mode", params.isSubscription ? "subscription" : "payment");
  form.append("customer_email", params.buyerEmail);
  form.append(
    "success_url",
    `${params.originUrl}/dashboard?checkout=success&product=${encodeURIComponent(params.productId)}`
  );
  form.append("cancel_url", `${params.originUrl}/gcse-maths?checkout=cancelled`);
  form.append("line_items[0][quantity]", "1");
  form.append("line_items[0][price_data][currency]", "gbp");
  form.append(
    "line_items[0][price_data][unit_amount]",
    String(params.amountPence)
  );
  form.append(
    "line_items[0][price_data][product_data][name]",
    params.productName
  );
  if (params.isSubscription) {
    form.append(
      "line_items[0][price_data][recurring][interval]",
      "month"
    );
  }

  // Metadata for webhook fulfillment
  form.append("metadata[productId]", params.productId);
  form.append("metadata[buyerUserId]", params.buyerUserId);
  form.append("metadata[buyerEmail]", params.buyerEmail);
  form.append("metadata[beneficiaryStudentId]", params.beneficiaryStudentId);
  if (params.couponCode) {
    form.append("metadata[couponCode]", params.couponCode);
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Stripe Checkout creation failed: ${errText}`);
  }

  const json = (await res.json()) as { id?: string; url?: string };
  return {
    sessionId: json.id,
    checkoutUrl: json.url,
  };
}

/**
 * Verifies a Stripe Webhook HMAC-SHA256 signature (`Stripe-Signature` header).
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  webhookSecret?: string
): boolean {
  if (!webhookSecret) return false;
  if (!signatureHeader) return false;

  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const sigPart = parts.find((p) => p.startsWith("v1="));
  if (!timestampPart || !sigPart) return false;

  const timestamp = timestampPart.slice(2);
  const expectedSig = sigPart.slice(3);
  const signedPayload = `${timestamp}.${rawBody}`;
  const computedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computedSig, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch {
    return false;
  }
}
