import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "The limits of the information published on AXTO.dev about software development and developer tooling, and when to consult a professional.",
  alternates: { canonical: '/disclaimer' }
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-prose2 px-4 py-12">
      <h1 className="font-serif text-3xl font-black">Disclaimer</h1>
      <div className="ornament-rule mt-4 max-w-sm" />
      <p className="mt-4 text-sm opacity-60">Last reviewed: 4 October 2026</p>
      <div className="article-body mt-6">
        <p>AXTO.dev publishes general educational information about software development and developer tooling. Please read it with the following limits in mind.</p>
        <h2>Code is provided as-is</h2>
        <p>Code examples and commands on AXTO.dev are provided for learning, without warranty of any kind. Test them in a safe environment before using them on systems that matter, and adapt them to your own requirements.</p>
        <h2>Security</h2>
        <p>Security guidance on the site is educational. It is not a security audit or a guarantee that a system is secure. Never run commands you do not understand on production systems, and follow your organization's security policies.</p>
        <h2>Versions change</h2>
        <p>Tools, libraries and services change quickly. Commands and settings that worked when a guide was written may differ in later versions; check the official documentation for the version you use.</p>
        <h2>Trademarks</h2>
        <p>Product names and trademarks mentioned belong to their owners and are used only to identify the products discussed. A mention is not an endorsement.</p>
        <h2>Accuracy</h2>
        <p>We research carefully and review articles regularly, but information can become outdated. If you spot an error, please <a href="/contact" className="text-gold-600 underline">tell us</a>.</p>
        <h2>Advertising</h2>
        <p>Ads on the site are served by Google AdSense. We do not choose individual advertisers and are not responsible for their offers.</p>
      </div>
    </div>
  );
}
