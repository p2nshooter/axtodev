import type { Metadata } from 'next';

/**
 * Our own promotion (owner, 18 Oct 2026): axto.io and xaa.es, written for
 * AXTO.dev's readers — developers — and labelled openly. No ad slot.
 */
export const metadata: Metadata = {
  title: 'The AXTO ecosystem for builders — axto.io & XAA',
  description:
    'Our own promotion, labelled: axto.io’s developer platform, self-hosted tools and private AI workspace, and XAA, a studio that ships SaaS by milestone.',
  alternates: { canonical: '/ecosystem' }
};

const link = (base: string) => `${base}/?utm_source=axto.dev&utm_medium=referral&utm_campaign=ecosystem`;

export default function EcosystemPage() {
  return (
    <div className="mx-auto max-w-prose2 px-4 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-600">✦ Our own promotion</p>
      <h1 className="mt-2 font-serif text-3xl font-black">The AXTO ecosystem for people who build</h1>
      <div className="ornament-rule mt-4 max-w-sm" />
      <p className="mt-4 text-sm opacity-60">Last reviewed: 19 October 2026</p>
      <div className="article-body mt-6">
        <p>
          AXTO.dev writes hype-free guides to languages, tooling, performance and shipping. The same publisher also runs axto.io and XAA, and this page is
          where we tell you about them — openly, as an advertisement for our own work, with the same habit of saying what a tool does and what it does not.
        </p>

        <h2>axto.io — a realtime platform and a private AI workspace</h2>
        <p>
          <a href={link('https://axto.io')} className="text-gold-600 underline" rel="noopener">axto.io</a> is a set of AI applications plus the plumbing to build on
          them. The parts most relevant to developers:
        </p>
        <ul>
          <li>
            <strong>AXTO Connect</strong> — one realtime layer over REST, Server-Sent Events, WebSocket, long polling, HTTP/2 streaming, a gRPC-compatible
            Connect API, WebRTC rooms, signed webhooks and an MCP server for AI agents, with API keys and plan limits per account.
          </li>
          <li>
            <strong>Bring your own key</strong> — AI requests run on your own provider key and are only relayed, and Local Mode runs models on the user’s own
            machine when the plan and the operator allow it.
          </li>
          <li>
            <strong>Security Analyst</strong> — incident cases with logs parsed on your device, MITRE ATT&amp;CK mapping, indicators, phishing analysis and
            detection rules.
          </li>
          <li>
            <strong>Self-hosted products</strong> for Linux and Windows, shipped as Docker images with editions, trial licences and offline lifetime licences
            for teams that keep everything in-house.
          </li>
        </ul>
        <p>
          Treat it like any dependency: read the docs, test the limits that matter to you, and keep your own keys and data where your threat model says they
          belong.
        </p>

        <h2>XAA — when you need a team, not a tutorial</h2>
        <p>
          Sometimes the right move is to hand a build to people who do it every day. <a href={link('https://xaa.es')} className="text-gold-600 underline" rel="noopener">XAA</a> is
          a European web development studio for landing pages, company sites, e-commerce, marketplaces, SaaS and enterprise platforms. Work is cut into
          milestones that are agreed, delivered and paid one at a time, by PayPal, bank transfer or USDT, and there are ready-made templates for projects that
          should start from something proven. XAA’s site is in English, Spanish and Indonesian.
        </p>

        <h2>Our editorial line</h2>
        <p>
          AXTO.dev’s guides stay independent: no tutorial points to axto.io or XAA, and none bends its advice to fit them. If they save you a
          sprint, good. If not, the rest of this site is still about building better software with whatever stack you choose.
        </p>
      </div>
    </div>
  );
}
