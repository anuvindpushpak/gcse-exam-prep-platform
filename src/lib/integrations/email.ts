/**
 * Dual-Mode Transactional Email Service (Resend API + Graceful Sandbox Fallback).
 *
 * - When `RESEND_API_KEY` is configured in Railway / environment variables,
 *   sends real HTML transactional emails for 6-digit passwordless login codes
 *   and enrolment receipts.
 * - When `RESEND_API_KEY` is not yet configured, returns `{ sentLiveEmail: false }`
 *   so the UI automatically surfaces the 1-click confirmation preview code.
 */

export async function sendEmailConfirmationCode(params: {
  toEmail: string;
  code: string;
}): Promise<{ sentLiveEmail: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress =
    process.env.EMAIL_FROM?.trim() || "Examora <no-reply@examora.co.uk>";

  if (!apiKey) {
    return { sentLiveEmail: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [params.toEmail],
        subject: `${params.code} is your Examora confirmation code`,
        html: `
          <div style="font-family: Georgia, serif; background-color: #FAF9F5; padding: 36px; color: #141413;">
            <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8E4DB; border-radius: 20px; padding: 32px;">
              <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #0F4C3A; font-weight: 600; margin: 0 0 12px;">
                Examora · Examination Excellence
              </p>
              <h1 style="font-size: 24px; font-weight: 500; margin: 0 0 16px; color: #141413;">
                Your 6-digit confirmation code
              </h1>
              <p style="font-family: sans-serif; font-size: 14px; color: #57554F; line-height: 1.6; margin: 0 0 24px;">
                Enter the code below to verify your email address and access your Examora dashboard. This code is valid for 15 minutes.
              </p>
              <div style="background: #E6F0EC; border-radius: 14px; padding: 18px; text-align: center; font-family: monospace; font-size: 28px; font-weight: 700; letter-spacing: 0.25em; color: #0F4C3A;">
                ${params.code}
              </div>
              <p style="font-family: sans-serif; font-size: 12px; color: #6E6B64; margin: 24px 0 0;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      }),
    });

    return { sentLiveEmail: res.ok };
  } catch {
    return { sentLiveEmail: false };
  }
}

export async function sendPurchaseReceiptEmail(params: {
  toEmail: string;
  studentName: string;
  productName: string;
  amountFormatted: string;
  parentInviteCode?: string;
}): Promise<{ sentLiveEmail: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress =
    process.env.EMAIL_FROM?.trim() || "Examora <no-reply@examora.co.uk>";

  if (!apiKey) {
    return { sentLiveEmail: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [params.toEmail],
        subject: `Examora Enrolment Confirmed: ${params.productName}`,
        html: `
          <div style="font-family: Georgia, serif; background-color: #FAF9F5; padding: 36px; color: #141413;">
            <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8E4DB; border-radius: 20px; padding: 32px;">
              <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #0F4C3A; font-weight: 600; margin: 0 0 12px;">
                Examora · Enrolment Receipt
              </p>
              <h1 style="font-size: 24px; font-weight: 500; margin: 0 0 16px; color: #141413;">
                Access Unlocked for ${params.studentName}
              </h1>
              <p style="font-family: sans-serif; font-size: 14px; color: #57554F; line-height: 1.6; margin: 0 0 16px;">
                Thank you for enrolling in <strong>${params.productName}</strong> (${params.amountFormatted}). All 6 Foundation Tier modules, step-marked practice banks, and 3 full mock examinations are now unlocked.
              </p>
              ${
                params.parentInviteCode
                  ? `<div style="background: #FAF9F5; border: 1px solid #E8E4DB; border-radius: 12px; padding: 14px; font-family: sans-serif; font-size: 13px; color: #3D3B37;">
                      <strong>Parent / Guardian Link Code:</strong> <code style="color: #0F4C3A; font-weight: 700;">${params.parentInviteCode}</code>
                    </div>`
                  : ""
              }
            </div>
          </div>
        `,
      }),
    });

    return { sentLiveEmail: res.ok };
  } catch {
    return { sentLiveEmail: false };
  }
}
