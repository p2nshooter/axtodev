import type { Article } from './types';

/**
 * Consolidation: 92 overlapping articles into 23 that each cover their subject once.
 *
 * AdSense refused the site with "Low value content". Reading the library
 * explains why, and it was never only that the pieces were short. They repeat:
 *
 *   syscall abstraction        8 articles
 *   observability / logging    7
 *   microservices security     3
 *   CI/CD                      3
 *   CORS, cookies, debouncing, recursion, mutability, async,
 *   code review, containers, env vars, terminal, git branches   2 each
 *
 * The slug suffixes give the mechanism away. `-abg4`, `-bjgd`, `-vi91`,
 * `-exf7`, `-3u3w`, `-83gr` are the content bot's collision guard firing: it
 * generated a title that already existed and published anyway, because the
 * prompt only showed it the last forty titles. So 92 files are really about 23
 * subjects, written over and over at 360 words each.
 *
 * Merging is the remedy Google itself names for this, and the honest one: the
 * prose people wrote is kept, not regenerated. Each source article becomes a
 * section of the piece it belongs to, its title becoming the section heading,
 * with a newly written introduction tying them together. Nothing is thrown
 * away and nothing is machine-rewritten.
 *
 * EVERY OLD URL REDIRECTS. 91 slugs disappear from the library and each one
 * 308s to the article that absorbed it (see next.config.js). Deleting indexed
 * URLs without redirecting them would be a worse outcome than the duplication
 * — that is how a consolidation turns into 91 soft-404s.
 */

/** One consolidated article, declared rather than rewritten. */
interface Merge {
  slug: string;
  category: Article['category'];
  title: string;
  excerpt: string;
  /** The newly written opening that makes the parts read as one piece. */
  intro: string[];
  /** Slugs absorbed, in the order they should appear. */
  from: string[];
}

export const MERGES: Merge[] = [
  // ── languages ────────────────────────────────────────────────────
  {
    slug: 'how-numbers-behave-in-code',
    category: 'languages',
    title: 'How Numbers Behave in Code: Precision, Money and Off-by-One',
    excerpt:
      'Why 0.1 + 0.2 is not 0.3, why money should not be a float, and why the last item in a loop is where the bug lives. The three numeric mistakes that account for most of them.',
    intro: [
      'Numbers look like the part of programming that cannot surprise you. They are the part that surprises you most, because a computer stores them in a way that does not quite match the way you write them, and because counting from zero puts a boundary in a place your intuition does not.',
      'The three failures below come from the same root: a representation that is nearly, but not exactly, what you meant. Each is completely predictable once you can see the mechanism, which is what makes them worth understanding rather than memorising.',
    ],
    from: ['floating-point-numbers-explained', 'floating-point-money', 'off-by-one-errors'],
  },
  {
    slug: 'values-references-and-mutation',
    category: 'languages',
    title: 'Values, References and Mutation: Why Changing One Thing Changes Another',
    excerpt:
      'Copy an object, change the copy, and the original changes too. The single idea behind that whole family of bugs, and what immutability actually buys you.',
    intro: [
      'You copy something, change the copy, and the original changes as well. A function tidies up a list and the caller\'s list is different afterwards. These feel like separate mysteries and they are one: some values are copied when you assign them, and some are shared.',
      'Once you can tell which is which, the bugs stop being surprises and become predictable — and the case for leaving data alone rather than editing it in place stops being a style preference and becomes a way of removing a category of failure.',
    ],
    from: ['value-vs-reference-bugs', 'mutable-vs-immutable', 'mutable-vs-immutable-data'],
  },
  {
    slug: 'how-your-code-actually-runs',
    category: 'languages',
    title: 'How Your Code Actually Runs: Recursion, the Call Stack and Cost',
    excerpt:
      'What the machine is doing while your function calls itself, why a hash map lookup is effectively free, and how to tell which of your loops will fall over at scale.',
    intro: [
      'Two questions come up constantly and are usually answered separately: what happens when a function calls itself, and why does this code get so much slower with more data? They belong together, because both are questions about what the machine does with the shape you wrote.',
      'The call stack explains the first, growth classes explain the second, and the data structure you chose is usually the reason the answer is bearable or not. Taken together they are most of what you need to predict how code will behave before you run it.',
    ],
    from: ['what-is-recursion-really', 'recursion-and-the-call-stack', 'big-o-notation-plain-english', 'what-is-a-hash-map-really'],
  },
  {
    slug: 'asynchronous-programming-explained',
    category: 'languages',
    title: 'Asynchronous Programming Explained, From Callbacks to Await',
    excerpt:
      'What "async" actually changes about the order your code runs in, why await is not the same as waiting, and the mistakes that survive every syntax improvement.',
    intro: [
      'Asynchronous code is the part of a language that breaks the assumption everything else relies on: that the next line runs after this one. Once a call can finish later, order becomes something you arrange rather than something you get.',
      'The syntax has improved enormously and the underlying model has not changed at all, which is why the same mistakes survive each generation of it. This covers the model first, then the syntax, then the errors that outlive both.',
    ],
    from: ['understanding-async-await', 'embracing-async-programming-83gr', 'embracing-async-programming'],
  },
  {
    slug: 'writing-code-others-can-read',
    category: 'languages',
    title: 'Writing Code Others Can Read: Naming, Errors and Fewer Moving Parts',
    excerpt:
      'Naming is hard for a reason worth understanding, error handling is a design decision rather than a chore, and functional habits reduce what a reader has to hold in their head.',
    intro: [
      'Code is read far more often than it is written, usually by someone who has forgotten writing it. Everything below is about that reader: what a name tells them, what an error path admits, and how much state they have to keep track of to follow a function.',
      'None of it is about style rules. Each is a decision that changes how much a person has to reconstruct before they can safely change your code.',
    ],
    from: ['why-naming-is-hard', 'error-handling-patterns', 'embracing-functional-programming'],
  },

  // ── web ────────────────────────────────────────────────────────
  {
    slug: 'sessions-cookies-and-cross-origin',
    category: 'web',
    title: 'Sessions, Cookies and Cross-Origin: How the Browser Decides Who You Are',
    excerpt:
      'What a cookie actually is, how sessions and tokens differ, and why CORS blocks a request that works perfectly well from your terminal.',
    intro: [
      'Two things confuse people about browser requests more than anything else: how the server knows who is asking, and why the browser refuses a request that curl makes without complaint. They have the same root — the browser enforces rules on your behalf that no other client does.',
      'Cookies, sessions and tokens are how identity travels. Cross-origin rules are how the browser decides which of those a page is allowed to send. Understanding the second stops CORS looking like an obstacle and starts it looking like the protection it is.',
    ],
    from: ['cookies-sessions-and-tokens', 'cookies-sessions-tokens', 'cors-explained-for-humans', 'cors-explained'],
  },
  {
    slug: 'making-web-pages-fast',
    category: 'web',
    title: 'Making Web Pages Fast: What to Measure and What to Fix First',
    excerpt:
      'Speed is not one number. The metrics that map to how a page feels, the handful of causes behind most slow sites, and the fixes ranked by what they actually return.',
    intro: [
      'Users do not experience a page as a load time; they experience a sequence, and "slow" is a story about which step in that sequence went wrong. Optimising the wrong step is effort spent for nothing, so the first job is always to find out which one hurts.',
      'What follows is the measurement first, then the causes in the order they usually matter — the weight of the page, what blocks it from rendering, and where the bytes are served from.',
    ],
    from: ['why-your-web-page-is-slow', 'the-science-of-optimizing-web-performance', 'render-blocking-resources', 'lazy-loading-images', 'what-is-a-cdn'],
  },
  {
    slug: 'controlling-how-often-code-runs',
    category: 'web',
    title: 'Controlling How Often Code Runs: Debouncing, Throttling and Ordering',
    excerpt:
      'A handler that fires on every keystroke is a performance problem and an ordering problem, and the two need different fixes. Which to reach for, and when neither is enough.',
    intro: [
      'Some events arrive far faster than you want to react to them: typing, scrolling, resizing, dragging. The standard answers are debouncing and throttling, and they are not interchangeable — one waits for quiet, the other enforces a maximum rate.',
      'Both reduce how often your code runs. Neither decides which response wins when several are in flight at once, which is a separate problem that these tools are often mistakenly asked to solve.',
    ],
    from: ['debouncing-and-throttling', 'debouncing-throttling', 'embracing-async-programming-3u3w'],
  },
  {
    slug: 'designing-an-api-others-can-use',
    category: 'web',
    title: 'Designing an API Others Can Use: Status Codes, Idempotency and Schemas',
    excerpt:
      'Which status code to return and why it matters, why every write endpoint needs to survive being called twice, and what a schema buys you once more than one team depends on you.',
    intro: [
      'An API is a promise to somebody you will never meet, kept by code you will keep changing. Most of what makes one pleasant is not the shape of the JSON but whether its behaviour is predictable when things go wrong — a wrong status code, a retried write, a field that changed meaning.',
      'These cover exactly that: saying accurately what happened, surviving a duplicate request, and writing the contract down somewhere a machine can check it.',
    ],
    from: ['http-status-codes', 'idempotency-explained', 'mastering-the-art-of-api-design', 'the-pragmatics-of-protocol-buffers'],
  },
  {
    slug: 'interfaces-people-can-actually-use',
    category: 'web',
    title: 'Interfaces People Can Actually Use: Semantics, Forms and State',
    excerpt:
      'Using the right element is the cheapest accessibility win there is, forms are hard for reasons worth naming, and most interface bugs are really state bugs.',
    intro: [
      'A page can look finished and be unusable — to somebody navigating by keyboard, to somebody with a screen reader, or to anybody who fills in a form and loses it. None of that shows up in a screenshot.',
      'The three pieces below run from the markup outwards: what the elements themselves promise, why forms defeat so many attempts, and why the component that misbehaves is nearly always holding state it should not.',
    ],
    from: ['semantic-html-accessibility', 'why-forms-are-hard', 'stateful-frontend-components'],
  },

  // ── tools ─────────────────────────────────────────────────────
  {
    slug: 'git-in-practice',
    category: 'tools',
    title: 'Git in Practice: Branches, Recovery and a History Worth Reading',
    excerpt:
      'The commands that get you out of trouble, what a branch really is, why commit messages are the cheapest documentation you will write, and how to number a release.',
    intro: [
      'Most people use three Git commands until the day something goes wrong. The difference between panic and a calm two-minute fix is a slightly wider slice of it — and knowing that almost nothing is ever truly lost.',
      'This covers the model first, then recovery, then the two habits that make history useful to the person reading it later: messages that say why, and version numbers that mean something.',
    ],
    from: ['understanding-git-branches', 'git-commands-that-save-you', 'commit-messages-that-help', 'semantic-versioning'],
  },
  {
    slug: 'code-review-that-is-worth-the-time',
    category: 'tools',
    title: 'Code Review That Is Worth the Time',
    excerpt:
      'What review is actually for, what it reliably catches and what it never will, and how to leave a comment that improves the code without bruising the person.',
    intro: [
      'Review is the most expensive habit most teams keep, measured in the attention of the people who are hardest to replace. It earns that when it catches what tests cannot and spreads knowledge across a team; it wastes it when it becomes a style argument.',
      'What follows is what review is good at, what it is structurally bad at, and how to write comments that get the change made.',
    ],
    from: ['the-value-of-code-review', 'code-review-that-helps', 'the-art-of-code-reviews'],
  },
  {
    slug: 'the-terminal-and-everyday-debugging',
    category: 'tools',
    title: 'The Terminal and Everyday Debugging: Shell, Regex and Stack Traces',
    excerpt:
      'The shell skills that pay for themselves weekly, enough regular expressions to be useful without being clever, and how to read a stack trace to the line that actually broke.',
    intro: [
      'Three tools do most of the unglamorous work of a working day: the shell you type into, the pattern language you reach for when the shell is not enough, and the wall of text a program prints when it gives up.',
      'None of them reward mastery as much as they reward a small reliable core. This is that core — the parts you will use every week, and the reading method that turns a trace from noise into an answer.',
    ],
    from: ['terminal-basics-worth-knowing', 'terminal-skills-worth-learning', 'regular-expressions-survival', 'reading-a-stack-trace'],
  },
  {
    slug: 'what-a-syscall-actually-is',
    category: 'tools',
    title: 'What a System Call Actually Is, and Why the Abstraction Leaks',
    excerpt:
      'Every file you read and every packet you send goes through one. What happens at that boundary, what the layers above it hide, and when the hiding stops working.',
    intro: [
      'Underneath every language, framework and runtime is the same narrow doorway: a request to the operating system to do something your program is not allowed to do itself. Opening a file, sending bytes, asking the time, making a thread.',
      'The layers above that doorway exist to spare you from it, and they succeed almost always. This is about what actually happens down there, and about the cases — performance, error handling, resource exhaustion — where the abstraction stops covering for you and the details resurface.',
    ],
    from: [
      'syscall-abstraction',
      'syscall-abstraction-abg4',
      'syscall-abstraction-bjgd',
      'syscall-abstraction-simplifying-low-level-system-interactions',
      'embracing-syscall-abstraction',
      'syscall-abstraction-101',
      'syscall-abstraction-for-better-software',
      'syscall-abstraction-for-simplified-system-interactions',
    ],
  },

  // ── devops ──────────────────────────────────────────────────
  {
    slug: 'deploying-without-holding-your-breath',
    category: 'devops',
    title: 'Deploying Without Holding Your Breath',
    excerpt:
      'What actually happens behind the deploy button, the release strategies that limit the damage of a bad one, and why flags let you separate shipping code from turning it on.',
    intro: [
      'For a lot of developers, deploying is a button someone else configured and a held breath. Understanding the steps behind it turns a ritual into a process — and a process is something you can make boring.',
      'The pieces below run in the order they happen: build and promote an artifact, get it live without a cliff edge, keep a way back, and decouple releasing the code from switching the feature on.',
    ],
    from: ['what-happens-when-you-deploy', 'blue-green-deploys', 'safe-deploys-and-rollbacks', 'feature-flags'],
  },
  {
    slug: 'continuous-integration-from-first-principles',
    category: 'devops',
    title: 'Continuous Integration From First Principles',
    excerpt:
      'What CI and CD actually mean, what a pipeline is for beyond running tests, how the practice got here, and where to spend your testing effort inside it.',
    intro: [
      'CI and CD are used so loosely that they have nearly stopped meaning anything. Underneath the tooling there is a simple and quite demanding idea: everyone integrates their work constantly, and a machine proves the result still works before anyone relies on it.',
      'This covers the definitions, then what a pipeline is really buying you, then how the practice evolved — because most pipeline problems are a stage inherited from a workflow the team no longer follows — and finally what mix of tests belongs inside it.',
    ],
    from: ['ci-cd-explained-simply', 'what-is-ci-cd', 'the-evolution-of-continuous-integration-pipelines', 'the-testing-pyramid'],
  },
  {
    slug: 'containers-and-what-runs-your-code',
    category: 'devops',
    title: 'Containers, Virtual Machines and What Actually Runs Your Code',
    excerpt:
      'A container is not a small virtual machine, and the difference decides your start-up time, your isolation and your bill. Where serverless fits, and what it does to state.',
    intro: [
      'Containers and virtual machines are described interchangeably often enough that the distinction has blurred, which is unfortunate, because it is the distinction that explains why one starts in milliseconds and the other in seconds.',
      'From there the same question keeps returning at every level of abstraction, including serverless: if the thing running your code can vanish at any moment, where does your state live?',
    ],
    from: ['what-is-a-container', 'containers-vs-virtual-machines', 'embracing-serverless-state'],
  },
  {
    slug: 'logging-and-observability',
    category: 'devops',
    title: 'Logging and Observability: Knowing What Your System Is Doing',
    excerpt:
      'A log line that helps at three in the morning looks different from one that helps in development. What to record, what to aggregate, and why distributed systems need tracing rather than more logs.',
    intro: [
      'Every system tells you what it is doing. The question is whether it tells you in a form you can act on while something is on fire, or in a form you can only read afterwards.',
      'This runs from the single log line outwards: what makes one useful, what metrics add that logs cannot, and what changes once a request crosses several services and no single log file contains the whole story.',
    ],
    from: [
      'logging-that-helps',
      'reading-logs-and-observability',
      'embracing-observability',
      'the-pragmatics-of-observability',
      'the-pragmatics-of-observability-exf7',
      'mastering-distributed-logging',
      'the-rise-of-distributed-logging',
    ],
  },
  {
    slug: 'securing-a-distributed-system',
    category: 'devops',
    title: 'Securing a Distributed System: Trust, Boundaries and Failure',
    excerpt:
      'Splitting a system into services multiplies its boundaries, and every boundary is a decision about trust. What to authenticate, what to assume, and how to stop one slow service taking down the rest.',
    intro: [
      'A single application has one boundary worth defending. Split it into services and every call between them becomes a boundary too — each one a place where something has to decide whether the caller is who it claims to be.',
      'Security and resilience turn out to be the same conversation here, because both are about what happens when part of the system misbehaves: a compromised service and a failing one look remarkably similar from the outside.',
    ],
    from: [
      'the-pragmatics-of-microservices-security',
      'the-pragmatics-of-microservices-security-strategies-for-protecting-you',
      'the-pragmatics-of-microservices-security-vi91',
      'understanding-circuit-breakers',
      'embracing-distributed-architecture',
    ],
  },
  {
    slug: 'configuration-and-keeping-a-codebase-healthy',
    category: 'devops',
    title: 'Configuration, Secrets and Keeping a Codebase Healthy',
    excerpt:
      'Why code should never contain its own secrets, what to do the moment one leaks, and how to talk about technical debt in a way that gets it paid down.',
    intro: [
      'Two kinds of rot accumulate in a long-lived system. One is configuration drifting into the code until an artifact only works in the environment it was built for. The other is the debt that builds up whenever the shape of the code stops matching the shape of the problem.',
      'They are related more closely than they look: both are the cost of decisions that were reasonable when made and were never revisited, and both are cheaper to address continuously than in a project.',
    ],
    from: [
      'environment-variables-and-secrets',
      'environment-variables-done-right',
      'managing-technical-debt-with-code-refactoring',
      'embracing-domain-driven-design',
    ],
  },

  // ── ai ─────────────────────────────────────────────────────────
  {
    slug: 'using-ai-assistants-well',
    category: 'ai',
    title: 'Using AI Coding Assistants Well: When to Reach for One, When Not To',
    excerpt:
      'They are genuinely fast at some things and confidently wrong at others. The work each is suited to, the standard that has to survive, and the tasks worth doing yourself.',
    intro: [
      'The interesting question stopped being whether to use these tools some time ago. It is what they are actually good at, what they are structurally bad at, and how to get the first without importing the second into your codebase.',
      'What follows is the standard worth keeping, the work where an assistant genuinely earns its place, and the work where reaching for one costs you more than it saves.',
    ],
    from: ['ai-coding-assistants-safely', 'when-to-reach-for-ai-coding', 'when-not-to-use-ai'],
  },
  {
    slug: 'where-ai-gets-it-wrong',
    category: 'ai',
    title: 'Where AI Gets It Wrong: Hallucination, Review and Limits',
    excerpt:
      'A model that invents a plausible function is the failure most likely to reach your main branch. Why it happens, why review misses it, and what a model can and cannot check about your code.',
    intro: [
      'The mistakes worth understanding are not the obvious ones. Obvious errors get caught. The dangerous output is the kind that reads exactly like something correct — a function name that sounds right, a review comment that sounds thorough.',
      'This is about that category specifically: where it comes from in the way these systems work, why a human reader is poorly placed to spot it, and what that means for using a model to check code rather than to write it.',
    ],
    from: [
      'ai-hallucinations-for-developers',
      'ai-code-review-limits',
      'ai-code-review-and-testing',
      'understanding-saturation-in-machine-learning',
    ],
  },
  {
    slug: 'prompting-as-a-developer',
    category: 'ai',
    title: 'Prompting as a Developer: Getting a Useful Answer About Code',
    excerpt:
      'Most bad answers are bad questions. What context a model actually needs, how to ask about code specifically, and why explaining the problem out loud so often solves it before you finish.',
    intro: [
      'Prompting has attracted a great deal of mystique and very little of it survives contact with a real codebase. What actually changes the answer is mundane: what you included, what you left out, and how precisely you said what you wanted.',
      'And there is a long-standing debugging habit that turns out to explain a good deal of why this works at all — that describing a problem carefully to something that cannot help you frequently solves it anyway.',
    ],
    from: ['prompt-engineering-basics', 'prompting-llms-as-a-developer', 'rubber-duck-debugging'],
  },
];

/**
 * Build the consolidated articles from the library they absorb.
 *
 * The prose is carried over, not rewritten: each absorbed article contributes
 * its own sections, with its title promoted to a heading so the reader can see
 * where one subject ends and the next begins. Its own intro section (the one
 * with an empty heading) is folded under that heading rather than dropped, so
 * nothing anybody wrote is lost.
 */
export function buildMerged(all: Article[]): { merged: Article[]; absorbed: Set<string> } {
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const absorbed = new Set<string>();
  const merged: Article[] = [];

  for (const m of MERGES) {
    const sections: Article['sections'] = [{ h: '', p: m.intro }];
    let newest = '';
    let author = 'The AXTO.dev Desk';
    for (const slug of m.from) {
      const src = bySlug.get(slug);
      if (!src) continue; // a source that no longer exists is simply skipped
      absorbed.add(slug);
      if (src.date > newest) newest = src.date;
      author = src.author ?? author;
      for (const [i, s] of src.sections.entries()) {
        // The first section of a source has no heading of its own; it gets the
        // source's title, which is what makes the merged piece navigable.
        sections.push({ h: i === 0 ? src.title : s.h, p: s.p });
      }
    }
    if (sections.length === 1) continue; // nothing was absorbed; publish nothing
    merged.push({
      slug: m.slug,
      category: m.category,
      title: m.title,
      excerpt: m.excerpt,
      date: newest || new Date().toISOString().slice(0, 10),
      // Reading time is measured at render (see lib/reading-time.ts); this
      // field is not read and is kept only because the type requires it.
      minutes: 1,
      author,
      sections,
    });
  }
  return { merged, absorbed };
}
