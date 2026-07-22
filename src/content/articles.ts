import type { Article, Category } from './types';
import { ARTICLES_BATCH2 } from './articles-batch2';

// Developer-focused, original content — deliberately distinct from the sibling
// tech site so no article overlaps (duplicate content hurts everyone's AdSense).
export const CATEGORIES: Category[] = [
  { slug: 'languages', name: 'Languages & Fundamentals', tagline: 'The concepts under every language, explained plainly', icon: '💡' },
  { slug: 'web', name: 'Web & Performance', tagline: 'Building fast, accessible, resilient web apps', icon: '🌐' },
  { slug: 'tools', name: 'Tools & Workflow', tagline: 'Git, editors and the daily craft of coding', icon: '🛠️' },
  { slug: 'devops', name: 'Ship & Operate', tagline: 'Deploys, environments and running software in production', icon: '🚀' },
  { slug: 'ai', name: 'AI for Developers', tagline: 'Using AI assistants without shipping their mistakes', icon: '🤖' },
];

export const ARTICLES: Article[] = [
  {
    slug: 'big-o-notation-plain-english',
    category: 'languages',
    title: 'Big-O Notation in Plain English (No Maths Degree Required)',
    excerpt:
      'Big-O is just a way to describe how slow your code gets as the data grows. A practical guide to reading it, why it matters, and the handful of classes you meet in real work.',
    date: '2026-07-12',
    minutes: 9,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Big-O notation has a reputation for being academic, but it answers a very practical question: when your data gets ten times bigger, does your code take ten times longer, a hundred times longer, or barely any longer at all? That is the whole idea. It describes how the running time of an algorithm grows as the input grows, ignoring small constant details and focusing on the shape of the curve.',
        'You do not need calculus to use it. You need to recognise a few common growth classes and know which one your loop or lookup falls into. That is usually enough to spot the difference between code that runs instantly on a million rows and code that quietly grinds to a halt.'] },
      { h: 'The classes you actually meet', p: [
        'O(1), constant time, means the work does not grow with the input at all — reading one element of an array by index, or looking a key up in a hash map. O(n), linear time, means the work grows in step with the data: a single loop over a list. O(n log n) is the class of good sorting algorithms, a little worse than linear but still very usable at scale.',
        'The one to fear is O(n squared): a loop inside a loop, where doubling the data quadruples the work. It feels fine on ten items in your test and falls over on ten thousand in production. Most performance surprises in everyday code are an accidental nested loop, often hidden inside a helper that itself loops.'] },
      { h: 'Reading your own code for it', p: [
        'To estimate the Big-O of a function, count the nesting of loops over the input. One pass is O(n). A loop whose body loops again over the same data is O(n squared). A lookup in a set or map inside a single loop stays O(n), because the lookup itself is roughly constant — which is exactly why replacing an inner array search with a set is such a common and powerful fix.',
        'Recursion follows the same logic: work out how many times the function calls itself and over how much data each time. Halving the input each call, like a binary search, gives the log n factor that makes big inputs tractable.'] },
      { h: 'When it matters and when it does not', p: [
        'Big-O describes growth, not absolute speed, so on tiny inputs a "worse" algorithm can win because its constant overhead is lower. Do not rewrite a ten-item loop for asymptotic purity. The notation earns its keep when data can grow without a clear ceiling — user records, log lines, graph nodes — where the wrong class turns a feature into an outage.',
        'The practical habit is simple: when you write a loop over data that could get large, ask what happens at a hundred times the size. If the answer is "still fine", move on. If it is "it squares", that is the moment to reach for a map, a sort, or a smarter pass before it reaches production.'] },
    ],
  },
  {
    slug: 'value-vs-reference-bugs',
    category: 'languages',
    title: 'Value vs Reference: The Bug Behind Half Your Surprises',
    excerpt:
      'Why changing one variable mysteriously changes another. Understanding how languages copy values versus share references explains a huge share of confusing bugs.',
    date: '2026-07-08',
    minutes: 8,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'You copy an object, change the copy, and the original changes too. You pass a list into a function, the function tidies it up, and now your caller\'s list is different. These moments feel like the language is haunted, but they all come from one idea: some values are copied when you assign them, and some are shared by reference.',
        'Once you can tell which is which, a whole category of bugs stops being mysterious and becomes predictable. It is one of those fundamentals that pays back every day, in every language you touch.'] },
      { h: 'Primitives copy, objects share', p: [
        'Simple values — numbers, booleans, short strings in most languages — are copied when you assign or pass them. Change the copy and the original is untouched, because they were never linked. This is why passing a number into a function and incrementing it inside does not change the caller\'s number.',
        'Objects, arrays and other compound structures usually behave differently: the variable holds a reference — a pointer to the one underlying thing. Assigning it to another variable copies the pointer, not the contents, so both names now refer to the same object. Mutating through one name is visible through the other, because there is only one object.'] },
      { h: 'The functions-mutate-their-arguments trap', p: [
        'This is why a function that "just sorts" or "just cleans" a list can quietly rewrite data its caller still relies on. The function received a reference to the same array, and sorting in place changed the shared thing. The fix is to decide deliberately: either document that the function mutates, or make a copy at the top and work on that.',
        'Defaulting to non-mutating functions — take input, return a new value, leave the argument alone — removes an enormous amount of action-at-a-distance from a codebase. When a function must mutate for performance, making that explicit in its name and docs turns a hidden hazard into a clear contract.'] },
      { h: 'Shallow copies are only skin deep', p: [
        'The usual "copy this object" tools produce a shallow copy: a fresh top-level object whose nested objects are still shared references to the originals. Change a nested field and both copies see it. For flat data that is fine; for nested data it reintroduces the exact bug you were trying to avoid.',
        'When you genuinely need independence all the way down, reach for a deep copy — but know it is more expensive and can choke on cycles. Most of the time the cleaner answer is to avoid mutation in the first place, so the question of copying rarely comes up. Structure your data flow so shared references are read, not written.'] },
    ],
  },
  {
    slug: 'why-your-web-page-is-slow',
    category: 'web',
    title: 'Why Your Web Page Is Slow (and the Metrics That Actually Matter)',
    excerpt:
      'Speed is not one number. A practical tour of what makes pages feel slow, the Core Web Vitals worth watching, and the highest-return fixes for real sites.',
    date: '2026-07-14',
    minutes: 10,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Users do not experience your page as a single load time; they experience a sequence — blank screen, first content, something they can read, something they can click. "Slow" is really a story about how long each of those steps takes, and which one your particular page gets wrong. Optimising the wrong step is wasted effort, so the first job is knowing which step hurts.',
        'The good news is that the industry has converged on a small set of metrics that map well onto how a page actually feels, and browsers hand them to you for free. Learn those and you can stop guessing.'] },
      { h: 'The three vitals worth your attention', p: [
        'Largest Contentful Paint measures how long until the main content — usually the biggest image or heading — appears. It is the closest single number to "when does this page feel loaded". A slow LCP almost always traces back to a heavy image, a slow server response, or render-blocking resources at the top of the page.',
        'Interaction to Next Paint captures responsiveness: when the user taps or types, how long until the page visibly reacts. And Cumulative Layout Shift measures visual stability — how much the page jumps around as it loads, the infuriating effect where you go to tap a button and an ad pushes it away. Together these three describe loading, responsiveness and stability.'] },
      { h: 'The usual culprits', p: [
        'Images are the number one weight on most pages: unsized, uncompressed, and far larger than the space they display in. Serving appropriately sized, modern-format images and giving them explicit dimensions fixes both slow LCP and layout shift at once. It is the highest-return change on the majority of sites.',
        'JavaScript is the second: large bundles that must download, parse and execute before the page becomes interactive block the main thread and wreck responsiveness. Shipping less script, splitting it so only what a page needs loads, and deferring non-essential work are the levers. A third culprit — a slow server or database query — sits underneath everything, because nothing renders until the first bytes arrive.'] },
      { h: 'Measure real users, not just your laptop', p: [
        'Your development machine on fast office internet is the best case, not the typical case. Lab tools that simulate a mid-range phone on a slower connection give a truer picture, and field data collected from actual visitors tells you what your real audience experiences across their real devices.',
        'The workflow that works: measure to find the worst step, fix the biggest single cause of it, measure again. Chasing a perfect score on a synthetic test matters far less than moving the metric your real users feel. Performance is iterative, and a few targeted fixes usually recover most of the lost time.'] },
    ],
  },
  {
    slug: 'semantic-html-accessibility',
    category: 'web',
    title: 'Semantic HTML: The Accessibility Win You Get for Free',
    excerpt:
      'Using the right element instead of a generic container is one of the cheapest, highest-impact things you can do for accessibility, SEO and maintainability.',
    date: '2026-07-05',
    minutes: 7,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'It is entirely possible to build a whole website out of nothing but generic containers and styled text. It will look fine to a sighted mouse user and be nearly unusable to everyone else. Semantic HTML — using the element that actually describes the content, like a button for a button and a nav for navigation — is the difference, and it usually costs nothing but choosing the right tag.',
        'The payoff is broad: assistive technology understands the page, keyboard users can move through it, search engines parse it better, and other developers read it faster. Few decisions give so much for so little.'] },
      { h: 'Screen readers navigate by structure', p: [
        'A screen reader user does not scroll top to bottom; they jump — heading to heading, landmark to landmark, link to link. That navigation is built entirely on the elements you chose. Real headings let them skim the outline of a page. Landmark elements like header, nav, main and footer let them leap straight to the content. A page of undifferentiated containers offers none of these handholds, so the user is left crawling through everything.',
        'The same applies to controls. A real button is focusable, announced as a button, and triggers on both click and the keyboard by default. A generic element styled to look like a button does none of that unless you painstakingly reimplement it — and most reimplementations are incomplete. Using the native element gives you correct behaviour for free.'] },
      { h: 'The elements that carry meaning', p: [
        'Reach for headings to express hierarchy, in order, without skipping levels for visual effect. Use lists for lists, so their length and structure are announced. Use nav for groups of navigation links, main for the primary content, and article or section to group related content. Use button for actions and anchor links for navigation to a destination — the two are not interchangeable.',
        'For forms, associate every input with a real label. That single habit makes fields announceable, clickable by their label, and far easier to use for everyone. None of this requires extra libraries; it is HTML doing the job it was designed to do.'] },
      { h: 'It helps machines and humans too', p: [
        'Search engines lean on the same structure to understand what a page is about, so semantic markup quietly supports discoverability. And months later, the developer who opens your code — possibly you — reads a page of meaningful elements far faster than a wall of identical containers with class names doing all the explaining.',
        'The rule of thumb is small and reliable: before you style a generic container to act like something, check whether a native element already is that thing. Most of the time one exists, and using it is the accessible, durable, cheaper choice.'] },
    ],
  },
  {
    slug: 'git-commands-that-save-you',
    category: 'tools',
    title: 'Git Beyond Commit and Push: The Commands That Save You',
    excerpt:
      'Most developers use a fraction of Git. A practical set of commands for recovering from mistakes, understanding history, and working with more confidence.',
    date: '2026-07-10',
    minutes: 9,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Plenty of developers get by with three commands: add, commit, push. That works until the day something goes wrong — a bad merge, a change committed to the wrong branch, a file you did not mean to include. In those moments the difference between panic and a calm two-minute fix is knowing a slightly wider slice of Git.',
        'None of these require deep internals. They are everyday tools that turn Git from a thing you fight into a safety net you trust.'] },
      { h: 'Seeing where you are', p: [
        'Before changing anything, look. Status shows what is staged, modified and untracked. Diff shows the exact lines you are about to commit, which catches stray debug code and accidental edits before they enter history. Log, especially in its compact one-line form, shows the shape of recent history so you know which commit is which.',
        'Understanding the current state is half of using Git well. Most destructive mistakes happen because someone acted on an assumption about what was staged or which branch they were on. A five-second look replaces the assumption with a fact.'] },
      { h: 'Undoing safely', p: [
        'To discard uncommitted changes to a file, restore it. To unstage something you added by mistake without losing the work, restore it from the staging area. To keep changes but move them off the current branch, stash them, switch, and pop them back — invaluable when you started work on the wrong branch.',
        'For commits, reset moves the branch pointer: a soft reset keeps your changes staged, a mixed reset keeps them in your working files, and a hard reset throws them away — powerful and the one to respect. When you have already shared a commit and want to undo it without rewriting shared history, revert creates a new commit that cancels it out, which is the polite choice on shared branches.'] },
      { h: 'The recovery net most people miss', p: [
        'The command that saves careers is reflog. Git records almost every move of your branch pointers — commits, resets, checkouts — for weeks, even ones that seem lost. If a reset or rebase appears to have destroyed work, the reflog usually still lists the commit you were on, and you can return to it. Very little is ever truly gone in Git while the repository exists.',
        'Knowing that safety net is there changes how you work: you experiment more freely, because you know how to get back. That confidence, more than any single command, is what separates people who tolerate Git from people who use it well.'] },
    ],
  },
  {
    slug: 'commit-messages-that-help',
    category: 'tools',
    title: 'Writing Commit Messages Your Future Self Will Thank You For',
    excerpt:
      'A commit message is a note to whoever debugs this later — often you. A short guide to writing history that actually explains why the code changed.',
    date: '2026-06-30',
    minutes: 6,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Six months from now, someone will point a tool at a single line of code and ask: why is this here? The answer lives in the commit that introduced it — if that commit said anything useful. A message of "fix", "update" or "changes" answers nothing, and the trail goes cold exactly when you need it most.',
        'Good commit messages are not ceremony. They are the cheapest documentation you will ever write, produced at the one moment you fully understand the change: right after making it.'] },
      { h: 'Explain the why, not the what', p: [
        'The diff already shows what changed — which lines, which files. What it cannot show is why. A message that says "increase timeout to 30s because the export endpoint is slow for large accounts" tells a future reader something the code never could: the reason, the constraint, the trade-off. That context is what makes a change safe to modify later.',
        'A useful default shape is a short summary line under about fifty characters, written as an instruction ("Add retry to upload"), followed by a blank line and a paragraph of reasoning when the change is not obvious. Trivial changes need only the summary; subtle ones deserve the paragraph.'] },
      { h: 'One logical change per commit', p: [
        'A commit that bundles a bug fix, a rename and a new feature is impossible to describe honestly and impossible to revert cleanly. Keeping each commit to one logical change makes the history readable, makes reverting a single mistake possible, and makes review far easier because each step has one intention.',
        'This does not mean tiny commits for their own sake; it means each commit should be a coherent unit you could describe in one sentence without an "and". If your summary needs an "and", it is probably two commits.'] },
      { h: 'History is a feature, not exhaust', p: [
        'Treated well, the commit log becomes a searchable record of every decision the codebase ever made — why a workaround exists, when a bug was introduced, what a confusing function is actually for. Tools that trace a line back to its origin turn that record into instant answers, but only if the messages held real information.',
        'The habit costs a few extra seconds per commit and repays them many times over the first time a production incident sends you spelunking through history at speed. Write for the tired person debugging at midnight. It will often be you.'] },
    ],
  },
  {
    slug: 'the-testing-pyramid',
    category: 'tools',
    title: 'The Testing Pyramid: Where to Spend Your Test Effort',
    excerpt:
      'Not all tests are equal. A practical model for how many unit, integration and end-to-end tests to write, and why the shape matters for speed and confidence.',
    date: '2026-07-01',
    minutes: 8,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Teams often argue about how much to test as if it were one dial. It is not. There are different kinds of tests with very different costs and payoffs, and the useful question is not "how many tests" but "what mix". The testing pyramid is a simple mental model for that mix, and getting it roughly right is the difference between a suite that helps and one that everyone dreads.',
        'The shape matters because tests are code you also have to maintain, and slow, brittle tests get ignored or deleted — taking their protection with them.'] },
      { h: 'Three layers, three costs', p: [
        'At the base are unit tests: they check one function or module in isolation, run in milliseconds, and pinpoint failures precisely. They are cheap to write and cheap to run, so you can have thousands. In the middle are integration tests, which check that several parts work together — a service and its database, say. They are slower and catch a different class of bug: the wiring between components.',
        'At the top are end-to-end tests, which drive the whole system the way a user would. They give the most realistic confidence and are the slowest, flakiest and most expensive to maintain. The pyramid shape — many unit tests, fewer integration tests, a handful of end-to-end tests — reflects those costs.'] },
      { h: 'Why an inverted pyramid hurts', p: [
        'When a team relies mainly on slow end-to-end tests, the suite takes an age to run, fails intermittently for reasons unrelated to the code, and points vaguely at "something broke somewhere". Developers stop trusting it, stop running it, and stop adding to it. The protection quietly erodes even though the test count looks healthy.',
        'A broad base of fast unit tests inverts that experience: failures are quick and specific, the suite runs on every save, and it is pleasant enough that people keep it green. The heavier tests then guard the few critical user journeys where realistic, full-stack confidence genuinely earns its cost.'] },
      { h: 'Test behaviour, not implementation', p: [
        'The most durable tests check what a unit does, not how it does it — its inputs and outputs, its observable behaviour. Tests coupled to internal details break every time you refactor, punishing exactly the cleanup work you want to encourage. Behaviour-focused tests survive refactors and keep protecting you through change.',
        'A practical target: cover the logic that would be costly to get wrong, keep the fast layer broad, and reserve the slow layer for the journeys that must never break. A suite you trust and actually run beats an exhaustive one that everyone skips.'] },
    ],
  },
  {
    slug: 'what-happens-when-you-deploy',
    category: 'devops',
    title: 'What Actually Happens When You Deploy to Production',
    excerpt:
      'Deploy is a scary word until you know the steps behind it. A plain walk through building, releasing and the safety nets that let you ship without holding your breath.',
    date: '2026-07-13',
    minutes: 9,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'For a lot of developers, "deploy" is a button someone else set up and a held breath. Understanding what actually happens behind that button turns it from a ritual into a process you can reason about — and reasoning about it is what lets you ship small and often instead of rarely and fearfully.',
        'Underneath, almost every deployment is the same handful of steps: turn source into an artifact, get that artifact onto servers, switch traffic to it, and watch. The tools vary wildly; the shape does not.'] },
      { h: 'Build once, deploy the artifact', p: [
        'The first step is building: your source code is compiled, bundled and packaged into a single artifact — a container image, a zipped bundle, a set of static files. The crucial discipline is to build that artifact once and promote the exact same one through every stage. Rebuilding separately for staging and production invites the classic "worked in staging" failure, where subtle differences creep in.',
        'A good pipeline runs your tests against that artifact before it goes anywhere near users, so a red build never reaches production. The artifact that passed the tests is the artifact that ships — no surprises introduced in between.'] },
      { h: 'Releasing without a cliff edge', p: [
        'Getting new code live does not have to mean flipping every user to it at once. A rolling release updates servers a few at a time, so if the new version is broken, only a fraction of traffic is affected while it rolls. A blue-green release keeps the old version running, brings the new one up alongside it, and switches traffic over in one move — with the old version still warm for an instant rollback.',
        'A canary release goes further, sending a small slice of real traffic to the new version and watching its error and latency metrics before widening. Each of these is a way to limit the blast radius of a bad deploy, which is the whole game in production.'] },
      { h: 'The nets that make it safe', p: [
        'Three things make deploying calm rather than tense. Fast rollback: a one-command way back to the last known-good version, so a bad deploy is an inconvenience, not an incident. Health checks: automated probes that confirm the new version is actually serving before it takes full traffic. And observability: logs, metrics and alerts that tell you within minutes if something degraded.',
        'With those nets in place, the safest strategy is counter-intuitive to newcomers: deploy more often, in smaller pieces. Small changes are easy to review, easy to reason about, and easy to roll back. The teams that deploy many times a day are usually not braver — they have just built the nets that make each deploy boring.'] },
    ],
  },
  {
    slug: 'environment-variables-and-secrets',
    category: 'devops',
    title: 'Environment Variables and Secrets: Stop Committing Your Keys',
    excerpt:
      'Hardcoded API keys leak constantly. A clear guide to configuration through environment variables, keeping secrets out of source, and what to do if one slips.',
    date: '2026-07-06',
    minutes: 8,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'One of the most common and most damaging mistakes in software is committing a secret — an API key, a database password, a token — into source control. It feels harmless in the moment and becomes a serious exposure the instant that repository is shared, made public, or breached. Automated scanners crawl code hosts constantly looking for exactly these strings.',
        'The fix is a small shift in habit: code should never contain its own secrets or its environment-specific settings. Those come from outside, at run time, through configuration.'] },
      { h: 'Configuration lives outside the code', p: [
        'The standard mechanism is the environment variable: a named value the running process reads from its environment rather than from the source. The same build then behaves correctly in development, staging and production simply because each environment supplies different values — different database URLs, different keys, different feature flags. The artifact stays identical; only the configuration changes.',
        'This separation is not only about secrets. Anything that differs between environments — endpoints, limits, toggles — belongs in configuration, not baked into the code. The result is one artifact you can promote anywhere, and code that makes no assumptions about which environment it is in.'] },
      { h: 'Keeping secrets out of the repository', p: [
        'For local development, a dotenv file holds your values and is listed in the ignore file so it never gets committed — with a checked-in example file that lists the names but not the values, so a new teammate knows what to provide. In deployed environments, secrets come from the platform\'s own secret store or CI secret settings, injected as environment variables at run time and never written into the repo.',
        'The principle is consistent everywhere: the names of your settings can live in the codebase; the values, especially secret ones, must not. If you can read a real key by browsing the source, so can everyone else who ever sees it.'] },
      { h: 'When a secret leaks anyway', p: [
        'If a key does land in a commit, treat it as compromised the moment it was pushed — do not just delete the line. Rotate it: generate a new key at the provider and revoke the old one, so the exposed value stops working. Removing it from the latest commit is not enough, because it still lives in the repository\'s history and in any clone.',
        'Rotation is the real remediation; scrubbing history is secondary cleanup. Build the habit of rotating first and cleaning second, and add a secret scanner to your pipeline so the next near-miss is caught before it is ever pushed. Prevention is cheaper than every response.'] },
    ],
  },
  {
    slug: 'ai-coding-assistants-safely',
    category: 'ai',
    title: 'Using AI Coding Assistants Without Shipping Their Mistakes',
    excerpt:
      'AI assistants write plausible code fast — including plausible bugs. A practical approach to getting the speed without lowering your standards or your security.',
    date: '2026-07-15',
    minutes: 9,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'AI coding assistants are genuinely useful: they scaffold boilerplate, suggest an approach you had not considered, and turn a vague intent into a running draft in seconds. They are also confidently wrong on a regular basis, producing code that looks right, reads well, and fails in ways that are easy to miss precisely because it looks so reasonable.',
        'The skill is not deciding whether to use them; it is using them without letting their mistakes become yours. That comes down to treating their output as a draft from an eager junior, not a verdict from an expert.'] },
      { h: 'You own every line you commit', p: [
        'The moment you accept a suggestion, it is your code — your name is on the commit and your responsibility if it breaks. That framing keeps the standard where it belongs. Read what the assistant produced as carefully as you would read a colleague\'s pull request, because that is exactly what it is: a proposal that needs review before it earns your trust.',
        'The failure mode to avoid is accepting code you do not fully understand because it appears to work. Code you cannot explain is code you cannot debug, and it will eventually need debugging. If a suggestion uses an approach you do not follow, understand it or replace it before it goes in.'] },
      { h: 'The specific things to check', p: [
        'Assistants are trained on the average of public code, which means they cheerfully reproduce common insecurities: unvalidated input, string-built queries, secrets inlined for convenience, outdated patterns. Review generated code for the security basics with extra suspicion, because the model has no awareness of your threat model. They also invent things — a library function or an API method that sounds real and does not exist — so verify unfamiliar calls against real documentation.',
        'Edge cases are another blind spot. Generated code tends to handle the happy path and skip the empty list, the null, the concurrent write. Your tests, not the model, are what prove it actually works, so keep writing them.'] },
      { h: 'Where they genuinely shine', p: [
        'Used well, an assistant is a fast collaborator for the parts of the job that are more typing than thinking: repetitive transformations, first-draft tests, explaining an unfamiliar snippet, or exploring an approach before you commit to it. Letting it handle the mechanical work frees your attention for the design decisions that actually need a human.',
        'The developers who benefit most are not the ones who trust these tools the least or the most, but the ones with the judgement to know which is which — leaning on the assistant for speed while keeping their own hands firmly on the standard for what ships.'] },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
export function getArticlesByCategory(cat: string): Article[] {
  return ARTICLES.filter((a) => a.category === cat).sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Batch 2 merges into the same library; all lists sort by date.
ARTICLES.push(...ARTICLES_BATCH2);
