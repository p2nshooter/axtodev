import { LegalPage } from "@/components/site/legal-page";
import { MAX_LANGUAGE_DOWNLOADS_PER_BOOK } from "@/lib/constants";

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund & Download Policy" updated="July 2026">
      <h2>Refunds</h2>
      <p>
        Because e-books are delivered instantly, refunds are granted at our discretion — typically for duplicate
        purchases, failed downloads we cannot fix, or a book that was materially misdescribed. Contact Support within
        7 days of purchase with your order number.
      </p>
      <h2>Downloads</h2>
      <p>
        Each purchased e-book may be downloaded in up to {MAX_LANGUAGE_DOWNLOADS_PER_BOOK} languages of your choice,
        enforced server-side. Download links are signed and expire shortly after being issued for security — you can
        always generate a fresh link from your Library as long as you own the book.
      </p>
      <h2>After a refund</h2>
      <p>Once an order is refunded, associated download links are revoked and further downloads for that order are blocked.</p>
    </LegalPage>
  );
}
