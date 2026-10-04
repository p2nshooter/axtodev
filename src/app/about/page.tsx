import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About AXTO.dev",
  description: "Who we are, what AXTO.dev covers, how we research every guide on software development and developer tooling and why we stay independent.",
  alternates: { canonical: '/about' }
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-prose2 px-4 py-12">
      <h1 className="font-serif text-3xl font-black">About AXTO.dev</h1>
      <div className="ornament-rule mt-4 max-w-sm" />
      <p className="mt-4 text-sm opacity-60">Last reviewed: 4 October 2026</p>
      <div className="article-body mt-6">
        <p>AXTO.dev — Automation, eXtensions, Tooling & Ops — is an independent publication of developer explainers. We write clear, practical guides to the tools, patterns and practices behind modern software: automation, APIs, testing, deployment, security basics and the reasoning behind good engineering decisions.</p>
        <h2>What we cover</h2>
        <ul>
          <li>Automation: scripting, CI/CD pipelines and removing repetitive work.</li>
          <li>APIs and integrations: designing, consuming and debugging them.</li>
          <li>Tooling: editors, version control, build tools and package managers.</li>
          <li>Operations: deployment, monitoring, logging and reliability.</li>
          <li>Security basics: secrets, dependencies and common vulnerabilities, explained responsibly.</li>
        </ul>
        <h2>How we work</h2>
        <p>Every article is researched and written by our editorial team and checked against reliable sources before it is published. We explain technical terms in plain language, say clearly when evidence is limited or mixed, and update articles when the facts change. Our full standards are set out in our <a href="/editorial-policy" className="text-gold-600 underline">editorial policy</a>.</p>
        <h2>Independence</h2>
        <p>AXTO.dev is free to read and supported by advertising served by Google AdSense, which is kept clearly separate from our articles. We do not accept payment for coverage, and advertisers have no say in what we publish.</p>
        <h2>What we are not</h2>
        <p>Our articles are general information, not professional consulting, security auditing or legal advice. For decisions about your own situation, speak with a qualified security professional or your organization's engineering and legal teams.</p>
        <h2>Contact</h2>
        <p>Corrections, questions and topic ideas are welcome. See our <a href="/contact" className="text-gold-600 underline">contact page</a> or email <a href="mailto:hello@axto.dev" className="text-gold-600 underline">hello@axto.dev</a>.</p>
      </div>
    </div>
  );
}
