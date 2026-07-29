/**
 * Redirects for the article consolidation.
 *
 * 91 thin, overlapping articles were merged into 23 (see src/content/merges.ts
 * for why and for the grouping). Those 91 URLs are indexed, so each one has to
 * point at the article that absorbed it. Dropping them instead would turn a
 * clean-up into 91 soft-404s, which is a worse signal than the duplication
 * this is fixing.
 *
 * 308 rather than 302: the move is permanent and search engines should carry
 * the old page's standing across to the new one.
 *
 * This map mirrors the `from` lists in src/content/merges.ts. Next's config is
 * CommonJS and cannot import the TypeScript module, so the two are kept in
 * step by hand — if you add a merge there, add its sources here.
 */
const ABSORBED = {
  'how-numbers-behave-in-code': ['floating-point-numbers-explained', 'floating-point-money', 'off-by-one-errors'],
  'values-references-and-mutation': ['value-vs-reference-bugs', 'mutable-vs-immutable', 'mutable-vs-immutable-data'],
  'how-your-code-actually-runs': ['what-is-recursion-really', 'recursion-and-the-call-stack', 'big-o-notation-plain-english', 'what-is-a-hash-map-really'],
  'asynchronous-programming-explained': ['understanding-async-await', 'embracing-async-programming-83gr', 'embracing-async-programming'],
  'writing-code-others-can-read': ['why-naming-is-hard', 'error-handling-patterns', 'embracing-functional-programming'],
  'sessions-cookies-and-cross-origin': ['cookies-sessions-and-tokens', 'cookies-sessions-tokens', 'cors-explained-for-humans', 'cors-explained'],
  'making-web-pages-fast': ['why-your-web-page-is-slow', 'the-science-of-optimizing-web-performance', 'render-blocking-resources', 'lazy-loading-images', 'what-is-a-cdn'],
  'controlling-how-often-code-runs': ['debouncing-and-throttling', 'debouncing-throttling', 'embracing-async-programming-3u3w'],
  'designing-an-api-others-can-use': ['http-status-codes', 'idempotency-explained', 'mastering-the-art-of-api-design', 'the-pragmatics-of-protocol-buffers'],
  'interfaces-people-can-actually-use': ['semantic-html-accessibility', 'why-forms-are-hard', 'stateful-frontend-components'],
  'git-in-practice': ['understanding-git-branches', 'git-commands-that-save-you', 'commit-messages-that-help', 'semantic-versioning'],
  'code-review-that-is-worth-the-time': ['the-value-of-code-review', 'code-review-that-helps', 'the-art-of-code-reviews'],
  'the-terminal-and-everyday-debugging': ['terminal-basics-worth-knowing', 'terminal-skills-worth-learning', 'regular-expressions-survival', 'reading-a-stack-trace'],
  'what-a-syscall-actually-is': ['syscall-abstraction', 'syscall-abstraction-abg4', 'syscall-abstraction-bjgd', 'syscall-abstraction-simplifying-low-level-system-interactions', 'embracing-syscall-abstraction', 'syscall-abstraction-101', 'syscall-abstraction-for-better-software', 'syscall-abstraction-for-simplified-system-interactions'],
  'deploying-without-holding-your-breath': ['what-happens-when-you-deploy', 'blue-green-deploys', 'safe-deploys-and-rollbacks', 'feature-flags'],
  'continuous-integration-from-first-principles': ['ci-cd-explained-simply', 'what-is-ci-cd', 'the-evolution-of-continuous-integration-pipelines', 'the-testing-pyramid'],
  'containers-and-what-runs-your-code': ['what-is-a-container', 'containers-vs-virtual-machines', 'embracing-serverless-state'],
  'logging-and-observability': ['logging-that-helps', 'reading-logs-and-observability', 'embracing-observability', 'the-pragmatics-of-observability', 'the-pragmatics-of-observability-exf7', 'mastering-distributed-logging', 'the-rise-of-distributed-logging'],
  'securing-a-distributed-system': ['the-pragmatics-of-microservices-security', 'the-pragmatics-of-microservices-security-strategies-for-protecting-you', 'the-pragmatics-of-microservices-security-vi91', 'understanding-circuit-breakers', 'embracing-distributed-architecture'],
  'configuration-and-keeping-a-codebase-healthy': ['environment-variables-and-secrets', 'environment-variables-done-right', 'managing-technical-debt-with-code-refactoring', 'embracing-domain-driven-design'],
  'using-ai-assistants-well': ['ai-coding-assistants-safely', 'when-to-reach-for-ai-coding', 'when-not-to-use-ai'],
  'where-ai-gets-it-wrong': ['ai-hallucinations-for-developers', 'ai-code-review-limits', 'ai-code-review-and-testing', 'understanding-saturation-in-machine-learning'],
  'prompting-as-a-developer': ['prompt-engineering-basics', 'prompting-llms-as-a-developer', 'rubber-duck-debugging'],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async redirects() {
    return Object.entries(ABSORBED).flatMap(([to, sources]) =>
      sources.map((from) => ({
        source: `/articles/${from}`,
        destination: `/articles/${to}`,
        permanent: true,
      }))
    );
  },
};
module.exports = nextConfig;
const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
initOpenNextCloudflareForDev();
