import type { Article } from './types';

/**
 * AXTO.dev editorial library — batch 2. Ten original developer guides and
 * engineering stories. Same rules as batch 1: original writing only,
 * deliberately distinct from every sibling site's coverage.
 */
export const ARTICLES_BATCH2: Article[] = [
  {
    slug: "debugging-mindset-guide",
    category: "tools",
    title: "The Debugging Mindset: How Experienced Developers Actually Find Bugs",
    excerpt:
      "Juniors change code until the error goes away; seniors interrogate the system until it confesses. The repeatable method underneath effective debugging, with no tools required.",
    date: "2026-07-14",
    minutes: 8,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Watch a junior and a senior developer face the same mysterious bug and the difference is rarely typing speed or memorised APIs. The junior starts changing things — a flag here, a reorder there — hoping the error evaporates. The senior does something that looks slower and finishes faster: they stop, form a theory about what the system is actually doing, and design the smallest possible test of that theory. Debugging is not a search through code; it is a search through hypotheses.",
        "The method underneath is old, boring and astonishingly reliable — it is the scientific method wearing a hoodie. Observe precisely, hypothesise narrowly, test cheaply, repeat. Every debugging war story that ends well is this loop, run with discipline, under pressure."] },
      { h: "Reproduce first, or you are debugging fog", p: [
        "The first discipline is refusing to theorise about a bug you cannot reproduce. A reliable reproduction — even an ugly one, even one that takes ninety seconds of clicking — converts an anecdote into an experiment. Until then you are debugging witness testimony. Shrink the reproduction ruthlessly: half the input, half the steps, half the config. Every halving that still shows the bug cuts the suspect list roughly in half too.",
        "Intermittent bugs deserve the same treatment with different tools: logging around the suspected region, capturing the failing state, running the flaky test a thousand times in a loop overnight. 'Cannot reproduce' usually means 'have not yet controlled the variable that matters' — time, concurrency, data shape, environment. The variable you cannot control is very often the answer itself."] },
      { h: "Binary search beats staring", p: [
        "The single most transferable debugging technique is bisection. If the code worked last Tuesday and fails today, the bug entered in a known window — and version control can walk it: test the midpoint commit, discard the clean half, repeat. Tools like git bisect automate this into a dozen checkouts even across thousands of commits. The same halving works in space as well as time: comment out half the pipeline, stub half the modules, feed half the data. Ask 'is the bug in this half?' instead of 'where is the bug?'.",
        "Bisection's quiet superpower is that it requires no understanding of the bug at all — only a reliable way to ask 'is it broken here?'. Understanding arrives at the end, when the search corners the defect in a screenful of change. Staring, by contrast, requires you to already suspect the right place, which is precisely what you don't know yet."] },
      { h: "Read the error like it means it", p: [
        "A surprising share of debugging time is lost to not actually reading the error. The message names a file, a line, a type, an expectation — and the eye slides off it toward the code it already suspects. Slow down and parse the words literally: 'undefined is not a function' says something real was undefined at a real moment; a stack trace is a map with an X on it. When the message seems absurd — 'that file definitely exists' — the absurdity is information: some assumption in your model of the system (working directory, environment, version, cache) is false, and the bug lives in that gap.",
        "The final discipline is closing the loop. When the fix lands, ask why the bug was possible, whether its siblings exist elsewhere, and what test would have caught it — then write that test. A bug fixed without a lesson extracted is a bug scheduled for re-release. The developers people call wizards are mostly people who never pay for the same lesson twice."] },
    ],
  },
  {
    slug: "how-the-internet-loads-a-page",
    category: "web",
    title: "What Actually Happens When You Type a URL and Press Enter",
    excerpt:
      "DNS, TCP, TLS, HTML parsing, render trees — the classic interview question answered properly, as the story of one page load from keystroke to pixels.",
    date: "2026-07-15",
    minutes: 9,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "It is the most famous interview question in web development, and it deserves better than a memorised list: what happens between pressing Enter on a URL and seeing the page? The honest answer is a relay race across half the disciplines of computing — naming, routing, cryptography, parsing, layout — each leg measured in milliseconds. Understanding the legs is what turns performance work from cargo culting into engineering.",
        "Here is the race, run once, in order."] },
      { h: "Finding the server: DNS, TCP, TLS", p: [
        "First the name must become an address. The browser asks the operating system, which asks a resolver, which — on a cache miss — walks the DNS hierarchy from root to top-level domain to the site's own nameservers, returning an IP address. Caches at every layer mean the full walk is rare; its result is why the first visit to a domain is slower than the second.",
        "With an address in hand, the browser opens a TCP connection — the three-way handshake, one round trip — and then negotiates TLS, proving the server's identity via its certificate and agreeing on encryption keys, costing another round trip or two. This is why physical distance still matters on the modern web: every handshake is a trip to the server and back, and a server an ocean away charges you for each one. CDNs exist to move those round trips closer to your chair. Newer protocols (HTTP/3 over QUIC) fold parts of these handshakes together, but the shape is the same: naming, then connection, then trust."] },
      { h: "The response arrives: parsing and the two trees", p: [
        "The browser now sends the HTTP request and receives HTML — usually compressed, streamed in chunks. Parsing begins immediately, not at the end of the download, and this is where the page's dependency graph unfolds: stylesheets discovered in the head are fetched (they block rendering, because painting without styles would flash unstyled content); scripts without defer/async block parsing itself, which is exactly why script placement folklore exists; images and fonts queue up behind them.",
        "From the HTML the browser builds the DOM tree — the page's structure — and from the CSS the CSSOM — the rules that apply to it. Combined, they yield the render tree: only the visible elements, each with its final computed style. Layout then assigns every box its geometry, and paint fills in the pixels, often on the GPU, in layers so that later scrolling and animation can move cheaply. First paint is the moment the relay's baton crosses into the user's eyes — typically after two DNS-to-TLS handshakes, one HTML round trip, and the critical CSS."] },
      { h: "Why this map pays rent", p: [
        "Every performance technique you have ever been told is a move on this map. Preconnect warms the handshakes early; CDNs shorten every round trip; compressing and streaming HTML gets parsing started sooner; defer keeps scripts from blocking the parser; inlining critical CSS shortens the path to first paint; caching skips whole legs of the race on repeat visits. None of it is magic — each trick removes a specific, nameable wait from the story above.",
        "It also explains the mysteries. Why is the site fast locally and slow for users abroad? Round trips. Why did one synchronous analytics script freeze rendering? Parser blocking. Why does the second page load feel instant? Warm DNS, warm connection, warm cache. The next time a page feels slow, don't guess — ask which leg of the relay is dragging, measure it in the browser's network panel, and fix the leg rather than the vibe."] },
    ],
  },
  {
    slug: "naming-things-hardest-problem",
    category: "languages",
    title: "Naming Things Well: A Practical Guide to the Hardest Problem",
    excerpt:
      "Code is read ten times more than it is written, and names are most of what gets read. Concrete rules for names that make bugs visible and reviews fast.",
    date: "2026-07-16",
    minutes: 7,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "The old joke says there are two hard problems in computer science: cache invalidation, naming things, and off-by-one errors. The naming entry earns its place. Names are the user interface of code — the layer through which every future reader, including you in six months, perceives what the program does. A well-named codebase can be skimmed; a badly-named one must be decrypted.",
        "Naming is hard because it is compression: squeezing a concept, its type, its units, its lifecycle and its intent into a few words. But compression has rules, and they can be learned."] },
      { h: "Name the meaning, not the mechanics", p: [
        "The weakest names describe what a thing is made of; the strongest describe what it means. data, info, temp, obj, handler2 are mechanical names — true of almost anything, informative about almost nothing. unpaidInvoices, retryDelayMs, isEmailVerified each carry a claim about the world that the reader can check against the code. When a name states a meaning, a mismatch between name and behaviour becomes visible — which is exactly how good names catch bugs during review.",
        "Two mechanical habits deliver most of this: put units in names that have them (timeoutMs, priceUsd, distanceKm — entire spacecraft have been lost to implied units), and make booleans read as assertions (isActive, hasStock, canRetry) so conditionals read as sentences: if the order can retry, retry it."] },
      { h: "Scope decides how long a name should be", p: [
        "The classic fights — i versus index, short versus descriptive — dissolve under one principle: a name's length should grow with its scope. A loop counter alive for three lines can be i; everyone knows it, and a longer name would add noise, not clarity. A module-level constant read from fifty places deserves a full sentence-grade name like MAX_CONCURRENT_UPLOADS_PER_USER. The crime is inversion: cryptic abbreviations with global reach, or ceremonious names for two-line locals.",
        "The same principle governs functions. A private helper called three lines below its definition can be terse; a public API name is a promise made to strangers and should say exactly what it does — including its surprises. If a function is honestly named fetchUserAndUpdateLastSeen, the name itself is telling you it does two things, and that the design, not the name, needs work. Names that resist naming are design feedback."] },
      { h: "Consistency beats brilliance", p: [
        "A merely decent naming scheme applied everywhere outperforms scattered brilliance. If deleted things are removed in one module, destroyed in another and archived in a third, every reader pays a lookup tax forever. Pick one verb per concept — get for cheap reads, fetch for remote calls, build for construction, whatever your team likes — and enforce it in review as seriously as tests. The vocabulary of a codebase is an API, and synonyms are bugs in it.",
        "And when you find a lie — a name that no longer matches behaviour after refactors — fix it immediately, whatever the diff noise. A wrong name is worse than a vague one: readers trust it and inherit a false belief. Renaming is the cheapest documentation update in existence, and modern editors make it a keystroke. The codebase reads the way it is named; name it like you'll be the one reading."] },
    ],
  },
  {
    slug: "junior-developer-first-production-bug",
    category: "devops",
    title: "My First Production Incident: A Story Every Junior Developer Lives Through",
    excerpt:
      "A composite tale of the Friday deploy, the missing WHERE clause, and what a healthy team does next — told for everyone who hasn't had their turn yet.",
    date: "2026-07-17",
    minutes: 7,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Every developer carries one story they tell quietly, years later, to make a shaken junior feel human again. This is that story — a composite of a hundred true ones, names and stacks changed, arc identical. If you are early in your career and it has not happened to you yet: it will, roughly on schedule, and how your team responds will teach you more about engineering culture than any handbook.",
        "It begins, as tradition demands, on a Friday afternoon."] },
      { h: "The deploy", p: [
        "The ticket was small: archive stale customer sessions, a cleanup job, barely worth a review. The new developer — three months in, eager, careful — wrote the migration, ran it locally against the seeded database, watched twelve fake rows archive perfectly, and shipped it with a green pipeline. The job ran at 17:40. At 17:43 support channels lit up: users everywhere logged out, carts emptied, sessions gone. All of them. In the archiving query, the date condition had quietly not survived a refactor — a WHERE clause that filtered in development, where all data was stale anyway, and filtered nothing in production, where it archived every live session in the table.",
        "What the junior remembers is not the query. It is the physical sensation — cold hands, tunnel vision, the certainty of being fired within the hour — and the sound of the on-call senior pulling up a chair, looking at the screen, and saying the four most important words in engineering: 'Okay. Interesting. Let's look.' Not who did this. What is happening."] },
      { h: "The response", p: [
        "The next forty minutes were a masterclass nobody advertised as one. Roll forward or roll back? The sessions were archived, not deleted — the data existed, so a restore script could rebuild the table from the archive. One person wrote it; a second person read every line before it touched production, because the only thing worse than one bad mass-update is the hurried second one. Support posted an honest one-line status. By 18:30 sessions were restored; users grumbled and re-logged; the weekend survived.",
        "Monday's postmortem had a rule printed at the top of the template: blameless. The team walked the timeline and asked why the system allowed it — not who slipped. The answers wrote themselves: production and development data shapes diverged wildly; mass-update jobs had no dry-run mode; nothing counted affected rows and refused to proceed past a sane threshold; cleanup jobs deployed straight to all users instead of canarying. Four guardrails, four tickets, all shipped within the month. The junior wrote the postmortem personally — and got applause at the end of it."] },
      { h: "What the story is actually about", p: [
        "The uncomfortable truth the story encodes: a system in which one distracted junior can destroy every session on a Friday is a system that was always going to do that — the junior merely revealed the date. Blameless culture is not softness; it is accuracy. Individuals are the least reliable component in any architecture, and processes that depend on nobody ever being tired are not processes, they are wishes. Teams that punish the messenger teach everyone to hide the next incident until it is unhideable.",
        "So when your turn comes — and it will — remember the sequence: say it immediately and loudly, preserve the evidence, fix forward calmly with a second pair of eyes, and write the honest postmortem. Done that way, your worst day becomes the day the system got four guardrails and you became the person juniors come to, years later, shaken, needing to hear that everyone has one of these stories. You will pull up a chair and say: 'Okay. Interesting. Let's look.'"] },
    ],
  },
  {
    slug: "git-commits-tell-a-story",
    category: "tools",
    title: "Commit Messages Are for Time Travellers: Writing History You Can Use",
    excerpt:
      "Six months from now, someone will stare at your diff at 2 a.m. wondering why. Commit habits that turn version history from a junk drawer into a debugging instrument.",
    date: "2026-07-18",
    minutes: 7,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Every codebase ships with a second document that nobody designs on purpose: its history. Run the log and you will see which kind your team writes. One kind reads 'fix', 'fix again', 'wip', 'final fix FINAL' — a junk drawer. The other reads like a flight recorder: what changed, why, what it relates to. The difference costs nothing at write time and everything at read time, because the primary reader of a commit message is a stressed human at 2 a.m., six months from now, trying to work out why a line exists before they dare change it.",
        "That reader is very often you."] },
      { h: "The message: subject says what, body says why", p: [
        "The mechanics are settled convention. A short imperative subject line — 'Add retry to payment webhook', not 'Added' or 'adds' — that completes the sentence 'if applied, this commit will…'. Then a blank line, then the part that actually matters: the why. The diff already shows what changed; only the message can record what the diff cannot — the bug being fixed, the constraint being honoured, the alternative that was tried and rejected, the link to the issue. 'Increase timeout to 30s' is visible in the code. 'Payment provider's sandbox responds in up to 25s since their March upgrade' is knowledge that exists nowhere else.",
        "One habit upgrades everything: before committing, read the diff and ask what question a stranger would ask about it. Answer that question in the body. If there is genuinely no question — a typo fix, a rename — the subject alone is fine. History should be information-dense, not ceremonious."] },
      { h: "The unit: one idea per commit", p: [
        "Message quality is capped by commit shape. A commit that mixes a bug fix, a rename sweep and a drive-by refactor cannot be described honestly in one line — and worse, it cannot be reverted, cherry-picked or bisected as a unit. The discipline is one logical change per commit: the refactor that prepares, then the fix that lands, each standing alone, each buildable. Staging tools exist precisely to split a messy working directory into clean ideas.",
        "This is also what makes git bisect a superpower instead of a slog. Bisect finds the commit that introduced a bug; if that commit is 'wip Friday stuff' touching forty files across three concerns, the search ends in a shrug. If it is one idea with a why in the body, the search ends the investigation outright — the culprit commit is the diagnosis."] },
      { h: "History as an instrument", p: [
        "Treated this way, history answers questions nothing else can. Blame on a puzzling line leads to a commit whose body explains the constraint that shaped it. A log filtered to one file tells the story of a module's design pressure over years. A revert becomes safe because the commit is self-contained; a backport becomes a cherry-pick instead of a surgery. Teams even generate honest changelogs straight from subjects — a free by-product of discipline.",
        "None of this requires tooling, process meetings or a style guide longer than a page. It requires believing one thing: the code tells the machine what to do; the history tells humans why it does it. Write for the time traveller. You are them, soon."] },
    ],
  },
  {
    slug: "sql-indexes-mental-model",
    category: "languages",
    title: "Database Indexes: The Mental Model That Makes Queries Fast",
    excerpt:
      "Why is the query slow? Nine times out of ten the answer is an index — missing, unusable, or ignored. The phone-book model that explains indexing without a DBA in the room.",
    date: "2026-07-19",
    minutes: 8,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Sooner or later every application developer meets the same villain: a query that was instant in development and takes eleven seconds in production. The table grew, and something invisible changed. That invisible something is almost always an index — one that is missing, one that exists but cannot be used, or one the database chose to ignore. Indexes are the highest-leverage performance tool most developers half-understand, and the mental model that fixes that is older than computing: the phone book.",
        "A table without an index is a phone book with the pages shuffled: to find one name, you read every page. That is a full table scan — fine for a hundred rows, catastrophic for ten million. An index is the same book sorted, so you can open near the middle, halve, halve again, and land on the row in a handful of hops however huge the book grows. Sorted lookup is why indexed reads stay fast at any scale."] },
      { h: "What an index really costs", p: [
        "If indexes are magic, why not index everything? Because the sorted copy must be maintained. Every insert, update and delete now has to update every index on the table too — each one a little sorted structure demanding its place be found and its pages be shuffled. A table with a dozen indexes turns one write into a dozen. Indexes also occupy real disk and memory, competing with the data itself for cache.",
        "So indexing is a bet: you pay on every write to win on certain reads. The craft is betting only on reads that happen — which is why the honest starting point is not intuition but the database's own query plan. Every serious database will explain how it intends to run a query; the word to fear in that output is the one meaning 'scan', applied to a large table, inside something that runs per-request."] },
      { h: "Composite indexes and the leftmost rule", p: [
        "Real queries filter on several columns, which is what composite indexes are for — a phone book sorted by surname, then first name, then street. The order of columns in the index is everything, and it obeys the leftmost rule: an index on (country, city, created_at) accelerates filters on country, on country+city, and on all three — but does nothing for a filter on city alone, exactly as a surname-first phone book is useless for finding everyone named Maria. Most 'I added an index and nothing happened' mysteries are leftmost-rule violations.",
        "The other classic silent killer is wrapping an indexed column in a function or a type conversion inside the filter — asking for everyone whose lowercased surname matches. The sorted order was built on the raw value, so transforming the column throws the sort away and forces a scan. The fixes are mechanical once seen: filter on the raw column, store the searchable form, or create an index on the expression itself."] },
      { h: "A working checklist", p: [
        "When a query is slow: get the plan and look for the scan. Check what the filter and the join actually touch — foreign-key columns you join on are the most commonly forgotten indexes in every codebase. Match composite index order to your commonest filters, leftmost first, most selective early. Prefer a few indexes that serve many queries over one per query. And after adding one, read the plan again — the point is not to own indexes, it is to see the scan become a lookup.",
        "Then stop. Deleting unused indexes is as real an optimisation as adding missing ones, because every write pays for each of them forever. The database ships with the instruments to see all of this; the model — a sorted phone book, paid for on every write — is what makes the instruments readable."] },
    ],
  },
  {
    slug: "code-review-culture",
    category: "tools",
    title: "Code Review Without the Bruises: A Field Guide for Both Sides",
    excerpt:
      "Review is where teams either compound knowledge or grind each other down. Concrete habits for authors and reviewers that make review fast, kind and actually useful.",
    date: "2026-07-20",
    minutes: 8,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Code review is the highest-bandwidth teaching channel most teams possess, and also their most reliable generator of quiet resentment. The same mechanism that spreads knowledge, catches bugs and keeps a codebase coherent can, badly run, become a bottleneck where pull requests age like unpaid invoices and feedback lands like verdicts. The difference between the two outcomes is not tooling. It is a handful of habits, split evenly between the two sides of the diff.",
        "Worth stating first what review is for — because teams that never agree on this fight forever. Review exists to catch defects a second brain can see, to spread knowledge of the change through the team, and to keep the codebase consistent enough that anyone can work anywhere. It is not a gate for proving cleverness, a style tribunal, or a substitute for automated checks."] },
      { h: "The author's half: make reviewing cheap", p: [
        "Review quality is decided mostly before the review starts, by the shape of what is submitted. Small changes get good reviews; enormous ones get skimmed and rubber-stamped — reviewer attention collapses as the diff grows, which means the riskiest PRs systematically get the weakest scrutiny. Splitting work into reviewable slices is therefore not bureaucracy; it is how you purchase real review at all.",
        "The description is the second purchase. State what the change does, why now, how you tested it, and where you yourself are unsure — that last line is the most underused sentence in engineering, and it aims the reviewer's attention exactly where it pays. Walk your own diff before requesting review and annotate the surprising parts; every question you pre-empt is a round trip saved. And let machines do the machine work: formatters and linters in CI mean no human ever spends attention on indentation again."] },
      { h: "The reviewer's half: comment on the code, decide with judgement", p: [
        "The reviewer's first discipline is tone mechanics. Comment on the code, never the coder — 'this function re-reads the file per loop iteration' rather than 'you always do this'. Ask questions where you might be missing context: 'what happens if this list is empty?' both catches the bug and respects the possibility that it is handled elsewhere. Prefix the optional with 'nit:' so nobody mistakes taste for blockers — and when a whole thread is taste, say so and let it go. Consistency arguments belong in the style guide, once, not in every review.",
        "The second discipline is judgement about severity. Block on correctness, security, data loss, irreversible mistakes. Approve with comments for everything a follow-up can fix. The reviewer who blocks a working fix over a variable name is spending the team's trust budget on decoration — and trust is the currency that makes authors submit early, rough and honest instead of late, polished and defensive. Speed is part of quality too: a review that arrives in hours keeps the author's context warm; one that arrives in four days reviews code the author has already forgotten."] },
      { h: "What compounds", p: [
        "Run this way, review compounds. Juniors absorb the codebase's idioms PR by PR; seniors discover what is actually being built at the edges; bugs die in the cheapest phase of their lifecycle; and the written trail of questions and answers becomes documentation no one had to schedule. The team's shared standard rises without a single meeting about standards.",
        "The test of a healthy review culture is simple and brutal: do people submit their work early and unsure, or late and defended? Where review is a conversation between colleagues staring at the same problem, you get the first. Where it is a performance graded by a judge, you get the second — and the bugs ship inside the armour. Choose the conversation, one comment at a time."] },
    ],
  },
  {
    slug: "teaching-kids-to-code",
    category: "ai",
    title: "Teaching a Kid to Code: What Works, What Backfires, and Why Scratch Isn't a Toy",
    excerpt:
      "A developer-parent's field guide: ages and stages, block languages versus 'real' code, the AI question, and how to keep the spark alive past the first hour.",
    date: "2026-07-21",
    minutes: 8,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Sooner or later most developers face a small human asking what you do all day — and the tempting mistake of answering with a lecture about variables. Teaching children to code is a genuinely lovely project, but the developer instinct to start from fundamentals is precisely backwards for kids. Children do not fall in love with syntax. They fall in love with making something happen — a cat that dances, a game where the dragon chases their sister's name across the screen.",
        "The good news from classrooms and kitchen tables alike: the sequence that works is well mapped, the tools are free, and the total parental skill required is mostly restraint."] },
      { h: "Stages, not ages", p: [
        "Before reading fluency, screenless logic games and 'command the robot parent around the kitchen' teach sequencing — the real prerequisite. From roughly six or seven, block-based environments like Scratch are the serious choice, and calling them toys misses the point entirely: blocks remove typing and syntax errors, the two things that end sessions in tears, while preserving every concept that matters — loops, conditionals, events, variables, even concurrency when two sprites run at once. A child deep in Scratch is doing real computational thinking with the friction removed.",
        "The jump to text — usually Python, usually somewhere between ten and thirteen, when the child personally feels blocks are limiting — is best framed as a power-up, not a graduation. Same ideas, new costume: the loop they have used for years simply gains a keyboard spelling. Kids who move because they want features handle the shift easily; kids pushed early meet typos and cryptic errors before the motivation exists to push through them, and conclude coding is not for them. The child's boredom with blocks is the signal; the parent's impatience is not."] },
      { h: "The two great backfires", p: [
        "Backfire one is turning it into school: mandated sessions, exercises with right answers, correcting their messy code over their shoulder. The unicorn game with spaghetti logic that the child proudly demos beats the tidy exercise they abandoned — by exactly the margin that motivation beats curriculum. Let the project be theirs: games, animations, pranks, a quiz about their friends. Your role is asking 'what should it do next?' and being impressed at the demo, not auditing the blocks.",
        "Backfire two is rescuing too fast. The instinct to grab the mouse when the sprite goes the wrong way steals the exact experience being taught — the loop of it's broken, I wonder why, let me poke it, ha, got it. Debugging tolerance, not syntax, is the actual skill of childhood coding, and it only grows in children who get to be confused safely. Sit on your hands; ask what they've tried; celebrate the fix as theirs."] },
      { h: "The AI-era question", p: [
        "Today's kids will never code without AI assistants existing — so the honest question is not whether they'll use one, but what they should get from coding anyway. The answer is unchanged, and arguably stronger: the point was never producing lines of code, it was learning to decompose a fuzzy wish into precise steps, predict what a system will do, and investigate calmly when it does something else. Those skills are exactly what directing an AI requires, too. A child who can read a program and ask 'why did it do that?' will thrive; a child who can only paste and pray will not — with or without a career in software.",
        "Practically: early years need no AI at all — Scratch's whole design is that discovery is the game. For a text-language teenager, an assistant used as explainer ('what does this error mean?') is a patient tutor; used as vending machine ('write me the game'), it skips the loop where learning lives. The house rule that seems to work: AI may explain anything, but the fingers on the keyboard are yours. Which is, come to think of it, decent advice at any age."] },
    ],
  },
  {
    slug: "http-caching-guide",
    category: "web",
    title: "HTTP Caching Demystified: max-age, ETags and the Art of Not Sending Bytes",
    excerpt:
      "The fastest request is the one that never happens. How browser and CDN caching actually decide what to store, when to revalidate, and how to never break a deploy again.",
    date: "2026-07-13",
    minutes: 8,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Every performance conversation eventually lands on the same truth: the fastest network request is the one that never happens, and the second-fastest is the one answered with 'you already have it'. HTTP caching is the machinery for both — old, universally deployed, and so widely misunderstood that half the web disables it by accident and the other half breaks deploys with it.",
        "The whole system runs on a few headers deciding two questions: how long may a stored copy be reused without asking (freshness), and how do we ask cheaply when it expires (validation)?"] },
      { h: "Freshness: max-age and friends", p: [
        "Cache-Control is the contract. max-age says how many seconds the response may be reused without any network contact at all — the zero-round-trip case that makes repeat visits feel instant. public lets shared caches like CDNs store it; private restricts it to the one browser; no-store forbids storage entirely, which is the right call for personal or sensitive responses and wildly wasteful for everything else.",
        "The trap is that a cached copy cannot be recalled. Serve your homepage HTML with a day of max-age and users will see Tuesday's page on Wednesday, whatever you deploy. Freshness is a promise about the future, so long freshness belongs only on content whose future you control — which leads directly to the one pattern that solves it."] },
      { h: "The immutable-assets pattern", p: [
        "The modern playbook has two halves. Fingerprinted assets — files whose name contains a hash of their content, app.4f3a9c.js — get max-age of a year plus immutable, because a changed file gets a new name and is, by construction, a different URL. HTML gets little or no freshness but permits revalidation. Deploys then work like this: new assets upload under new names, the HTML that references them updates, and every browser picks up exactly the changed files with zero stale risk and zero unnecessary downloads.",
        "Validation covers the HTML half. An ETag (a content hash) or Last-Modified date travels with the response; when freshness expires the browser sends it back — 'I have version 4f3a9c' — and the server answers either with new content or with 304 Not Modified, a headers-only reply that costs one round trip and no body bytes. Revalidation is not as fast as freshness, but it converts full downloads into tiny confirmations, and for HTML that is the right trade: always current, nearly free."] },
      { h: "CDNs, and a checklist", p: [
        "A CDN is simply a shared cache you rent by the edge, obeying the same headers — with one superpower browsers lack: purging. That enables the advanced pattern — long shared freshness (s-maxage) for the CDN plus instant purge on deploy — and the gentler stale-while-revalidate, which serves the stored copy immediately while refreshing behind the scenes, hiding revalidation latency entirely. Together they give dynamic sites CDN speed with same-minute updates.",
        "The checklist that prevents ninety percent of caching grief: fingerprint every static asset and cache it for a year as immutable; give HTML no-cache-style revalidation rather than long freshness; mark personal responses private or no-store so a shared cache never leaks one user's page to another; and confirm behaviour in the network panel — a served-from-cache asset and a 304 look very different from a silent re-download. Get those four right and your site ships fewer bytes than your competitors' by default, forever."] },
    ],
  },
  {
    slug: "side-project-finishing-guide",
    category: "devops",
    title: "How to Actually Finish a Side Project (For Once)",
    excerpt:
      "The graveyard of half-built apps is where developer motivation goes to die. Why side projects stall at 80%, and the scope tricks that get version one out the door.",
    date: "2026-07-12",
    minutes: 7,
    author: "The AXTO.dev Desk",
    sections: [
      { h: "", p: [
        "Every developer owns a private graveyard: the folder of projects that were exciting for three weekends and untouched since. The pattern is so universal it deserves study rather than shame — because the forces that kill side projects are structural, and structure is something developers know how to refactor.",
        "The classic death is not the beginning, which is euphoric, and not the middle, which is honest work. It is the last twenty percent — auth, error states, deployment, the settings page — where novelty has worn off and only discipline remains. Understanding that the wall is scheduled is the first step to building for it."] },
      { h: "Scope is the project", p: [
        "The single strongest predictor of finishing is the size of version one. Not the idea's size — the version's. 'A recipe app' is unfinishable; 'a page where I paste a URL and get the ingredient list, deployed, usable by me' is a fortnight. The discipline is defining done before writing code: one sentence, one user (you), one core loop, written where you will see it. Everything else — accounts, sharing, dark mode, the mobile app — goes in a file named LATER, which is where enthusiasm can be safely parked without being argued with.",
        "The professional instincts that serve you at work actively sabotage you here. Production-grade architecture, test coverage, scalable infrastructure — for a tool with one user, those are procrastination wearing a hard hat. A side project earns engineering rigour by surviving long enough to need it. Version one's stack should be the most boring thing you already know, deployed the laziest way that works."] },
      { h: "Momentum mechanics", p: [
        "Side projects run on a different fuel than jobs: there is no external deadline, so the system must generate its own pull. Small sessions beat heroic weekends — forty-five minutes that end with one visible change keep the loop warm, while the every-few-weeks marathon spends its first hour just remembering the code. End every session by writing the next session's first task in one line; future-you starts moving instead of deciding, and starting is the whole battle.",
        "Ship embarrassingly early to an audience of one: yourself, using the thing for real. Real use is the only feedback that reliably re-ignites motivation — the missing feature you personally crave beats any roadmap, and the first time the tool actually saves you a minute is the moment the project stops being homework. If it is meant for others, show it while it is still slightly shameful; one stranger's 'oh, I'd use that' funds a month of evenings."] },
      { h: "Finished is a decision", p: [
        "Here is the reframe that empties graveyards: finished does not mean feature-complete — it means version one does its one job and you declared it so. Cut until the core loop is reachable, ship it, tag it, tell someone. Whatever happens next — growth, abandonment, a rewrite — it happens to a finished thing, and you become a person who finishes, which compounds across every project after.",
        "And grant yourself the honest exit: some projects are done teaching you what they had to teach by week three, and archiving them deliberately is not failure, it is portfolio management. The graveyard's real cost was never the dead code — it is the quiet belief that starting is all you know how to do. Break that once, at any scale, and side projects turn back into what they were supposed to be: the most fun a developer has all week."] },
    ],
  },
];
