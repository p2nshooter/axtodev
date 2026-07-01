import "server-only";
import { Resend } from "resend";

let client: Resend | undefined;

function getClient(): Resend | undefined {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return undefined;
  if (!client) client = new Resend(apiKey);
  return client;
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/** Fails soft: logs and returns rather than throwing, so a missing/invalid
 *  RESEND_API_KEY never breaks checkout or account flows (spec: fail-safe
 *  design — non-critical services shouldn't take down the app). */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const resend = getClient();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping email "${subject}" to ${to}`);
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "AXTO.dev <no-reply@axto.dev>",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("[email] send failed", error);
  }
}

export function purchaseReceiptEmail(params: {
  customerName: string;
  orderNumber: string;
  totalFormatted: string;
  items: Array<{ title: string; priceFormatted: string }>;
  libraryUrl: string;
}): string {
  const rows = params.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;color:#3a2f1c">${item.title}</td><td style="padding:8px 0;text-align:right;color:#3a2f1c">${item.priceFormatted}</td></tr>`,
    )
    .join("");

  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#0d0b08;color:#f5ecce;padding:32px;border-radius:12px">
    <h1 style="color:#e0bd67;font-size:22px;margin:0 0 8px">AXTO.dev</h1>
    <p style="color:#cbb98a">Thank you, ${params.customerName}. Your order is confirmed.</p>
    <p style="color:#cbb98a">Order <strong>${params.orderNumber}</strong></p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}</table>
    <p style="font-weight:bold;color:#e0bd67">Total: ${params.totalFormatted}</p>
    <a href="${params.libraryUrl}" style="display:inline-block;margin-top:16px;background:#e0bd67;color:#111;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Open your library</a>
    <p style="font-size:12px;color:#8a7c5c;margin-top:24px">Distributed by AXTO.dev — knowledge, transform, opportunity.</p>
  </div>`;
}
