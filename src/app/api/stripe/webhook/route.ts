import { NextRequest, NextResponse } from "next/server";
import { recordProductPurchase } from "@/lib/db/store";
import { sendPurchaseReceiptEmail } from "@/lib/integrations/email";
import { verifyStripeWebhookSignature } from "@/lib/integrations/stripe";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

    if (webhookSecret) {
      const valid = verifyStripeWebhookSignature(
        rawBody,
        signature,
        webhookSecret
      );
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid Stripe webhook signature" },
          { status: 400 }
        );
      }
    }

    const event = JSON.parse(rawBody) as {
      type?: string;
      data?: {
        object?: {
          metadata?: {
            productId?: string;
            buyerUserId?: string;
            buyerEmail?: string;
            beneficiaryStudentId?: string;
            couponCode?: string;
          };
        };
      };
    };

    if (event.type === "checkout.session.completed") {
      const meta = event.data?.object?.metadata;
      if (meta?.productId && meta?.beneficiaryStudentId) {
        const purchase = recordProductPurchase({
          buyerUserId: meta.buyerUserId || meta.beneficiaryStudentId,
          buyerEmail: meta.buyerEmail || "student@demo.uk",
          beneficiaryStudentId: meta.beneficiaryStudentId,
          productId: meta.productId,
          couponCode: meta.couponCode,
        });

        await sendPurchaseReceiptEmail({
          toEmail: purchase.buyerEmail,
          studentName: "Student",
          productName: purchase.productName,
          amountFormatted: `£${(purchase.amountPence / 100).toFixed(2)}`,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
