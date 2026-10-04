import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach the AXTO.dev editorial team with corrections, questions or topic suggestions.",
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-prose2 px-4 py-12">
      <h1 className="font-serif text-3xl font-black">Contact</h1>
      <div className="ornament-rule mt-4 max-w-sm" />
      <p className="mt-4 text-sm opacity-60">Last reviewed: 4 October 2026</p>
      <div className="article-body mt-6">
        <p>You can reach the AXTO.dev editorial team at <strong><a href="mailto:hello@axto.dev" className="text-gold-600 underline">hello@axto.dev</a></strong>. We read every message and usually reply within a few working days.</p>
        <h2>What to write to us about</h2>
        <ul>
          <li><strong>Corrections:</strong> tell us which article contains an error or outdated information and, if you can, point us to a source. We correct mistakes promptly.</li>
          <li><strong>Questions:</strong> if something in an article is unclear, ask. Your question may improve the article for everyone.</li>
          <li><strong>Topic suggestions:</strong> tell us what you would like us to explain next.</li>
        </ul>
        <h2>What we cannot do</h2>
        <ul>
          <li>We cannot give professional consulting, security auditing or legal advice about your individual situation.</li>
          <li>We do not accept payment for articles, links or reviews.</li>
          <li>We never ask readers for passwords, payment or personal financial details.</li>
        </ul>
        <h2>Privacy</h2>
        <p>We use your email address and message only to reply to you and never add you to a mailing list. See our <a href="/privacy" className="text-gold-600 underline">privacy policy</a>.</p>
      </div>
    </div>
  );
}
