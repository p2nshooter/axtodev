import { LegalPage } from "@/components/site/legal-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <p>
        AXTO.dev collects only the personal information necessary to operate the marketplace: your name, email,
        purchase history, and technical data needed to secure downloads (IP address, device/session metadata).
      </p>
      <h2>What we store</h2>
      <p>Account details, order and payment records (never full card numbers — payments are processed by PayPal),
      crypto payment quotes/addresses you interact with, download logs, and support communications.</p>
      <h2>Why</h2>
      <p>To fulfill purchases, prevent piracy and fraud, provide customer support, and comply with legal obligations.</p>
      <h2>Your rights</h2>
      <p>You may request a copy of your data or request deletion of your account, subject to records we must retain
      for legal, tax, or anti-fraud purposes, via our Support Center.</p>
      <h2>Third parties</h2>
      <p>We share data only with the providers necessary to run the service: PayPal, Cloudflare (hosting, storage),
      and Resend (transactional email).</p>
    </LegalPage>
  );
}
