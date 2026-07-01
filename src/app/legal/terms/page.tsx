import { LegalPage } from "@/components/site/legal-page";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 2026">
      <p>
        These Terms govern your use of AXTO.dev. By creating an account or purchasing an e-book, you agree to these
        Terms.
      </p>
      <h2>1. What we sell</h2>
      <p>
        AXTO.dev sells digital e-books that are either 100% original, in the public domain, or distributed under a
        license (PLR, MRR, royalty-free, or company-owned) that permits commercial redistribution. We never publish
        pirated, leaked, or copyright-infringing content.
      </p>
      <h2>2. License to you</h2>
      <p>
        A purchase grants you a personal, non-transferable license to read and download the e-book for your own use,
        subject to the language-download limits described in our Refund & Download Policy. You may not redistribute,
        resell, or publicly share purchased files.
      </p>
      <h2>3. Accounts</h2>
      <p>You are responsible for keeping your account credentials secure and for all activity under your account.</p>
      <h2>4. Payments</h2>
      <p>
        We accept PayPal and select cryptocurrencies. Crypto payments are quoted at a live market rate for a limited
        time window; the quote is void once it expires. All prices are in USD unless stated otherwise.
      </p>
      <h2>5. Termination</h2>
      <p>We may suspend accounts that violate these Terms, attempt to circumvent download limits, or engage in fraud.</p>
      <h2>6. Contact</h2>
      <p>Questions about these Terms can be sent through our Support Center.</p>
    </LegalPage>
  );
}
