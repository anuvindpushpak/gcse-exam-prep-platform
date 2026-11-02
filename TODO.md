# Examora — Production Go-Live & Infrastructure TODO (Stage 3)

This checklist tracks the commercial, database, authentication, and compliance infrastructure items deferred until production go-live on Railway.

---

## 1. Persistent Cloud Database (Railway PostgreSQL + Prisma)
- [ ] Provision a managed **PostgreSQL** service inside the Railway project (`Exam Preparation Package`).
- [ ] Connect `DATABASE_URL` in Railway environment variables to `prisma/schema.prisma`.
- [ ] Run `npx prisma migrate deploy` and seed initial curriculum specifications (`Edexcel 1MA1`, `AQA 8300`, `OCR J560`), topics, learning resources, and verified question bank items.
- [ ] Replace `src/lib/db/store.ts` JSON file persistence (`data/runtime-db.json`) with Prisma Client queries so student accounts, captured diagnostic leads, assessment attempts, and purchases persist across container restarts and deployments.

---

## 2. Live Stripe Checkout, Subscriptions & Webhooks
- [ ] Configure live Stripe products and Price IDs:
  - **Product 1:** `GCSE Maths Grade 4 Preparation Pack` — £39.99 one-time payment (`mode: "payment"`).
  - **Product 2:** `Weekly GCSE Maths Exam Practice Membership` — £7.99/month recurring (`mode: "subscription"`).
- [ ] Create `/api/stripe/checkout` endpoint to generate real Stripe Checkout Sessions with `client_reference_id` tied to the student/buyer account.
- [ ] Create `/api/stripe/webhook` endpoint to handle:
  - `checkout.session.completed` (unlock `FULL_PACK` or `WEEKLY_MEMBERSHIP` entitlement).
  - `customer.subscription.updated` & `customer.subscription.deleted` (sync recurring membership status).
- [ ] Add **Stripe Customer Billing Portal** link in the User Profile menu for managing or cancelling the £7.99/month membership.

---

## 3. Production Authentication & Transactional Emails
- [ ] Integrate production authentication (NextAuth.js / Auth.js or Clerk) supporting:
  - Email magic links / password sign-in for Students and Parents.
  - Parent-to-Student account linking via unique `parentInviteCode`.
  - Role-based access control (`STUDENT`, `PARENT`, `ADMIN`) enforced at middleware and API route levels.
- [ ] Connect transactional email provider (Resend / Postmark) for:
  - Welcome & account verification emails.
  - Purchase receipts and Parent Invite Code instructions.
  - Optional weekly progress digest for linked Parents/Guardians.

---

## 4. Legal, Safeguarding & Compliance Pages (UK GDPR & ICO Children's Code)
- [ ] Publish dedicated `/privacy` (Privacy Notice & ICO Age-Appropriate Design Code statement).
- [ ] Publish dedicated `/terms` (Terms of Service, Digital Content Cancellation & Refund Policy).
- [ ] Configure custom production domain (e.g., `examora.co.uk`) and SSL on Railway.

