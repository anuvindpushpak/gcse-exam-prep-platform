# Examora — Production Environment & Live API Key Switches

All **Stage 1**, **Stage 2**, **Tier 1 (Multi-Client Beta Readiness)**, and **Tier 2 (Commercial, Legal & Integration Infrastructure)** features are now built into the codebase and deployed to Railway.

## Built-In Smart Switches (Optional Environment Variables on Railway)

The platform runs out-of-the-box with zero external API keys required (using 100% Early Adopter coupons like `EARLY100` / `PILOT100` and 1-click email code confirmation). Whenever you want to turn on live credit card charging or live SMTP email delivery, set these variables in your Railway Service **Variables** tab:

1. **Live Stripe Checkout & Webhooks (`src/lib/integrations/stripe.ts` & `/api/stripe/webhook`):**
   - `STRIPE_SECRET_KEY=sk_live_...` (or `sk_test_...`)
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (pointing to `https://exam-preparation-package-production.up.railway.app/api/stripe/webhook` for `checkout.session.completed`)
   - *Behaviour:* When `STRIPE_SECRET_KEY` is present and the payable amount after coupon is > £0.00, checkout automatically redirects to Stripe Checkout. When a 100% coupon (`EARLY100`) is applied, it unlocks immediately for £0.00 without requiring a card.

2. **Live Transactional Emails (`src/lib/integrations/email.ts`):**
   - `RESEND_API_KEY=re_...`
   - `EMAIL_FROM=Examora <no-reply@yourdomain.co.uk>`
   - *Behaviour:* When `RESEND_API_KEY` is present, 6-digit passwordless login codes and purchase receipts are sent as HTML emails via Resend, and the on-screen preview code is hidden.

3. **Persistent Storage Across Redeploys (`src/lib/db/store.ts`):**
   - Attach a Railway Volume mounted at `/data` and set `RAILWAY_VOLUME_MOUNT_PATH=/data` (or `PERSISTENT_DATA_DIR=/data`) so `runtime-db.json` persists across container redeployments.
