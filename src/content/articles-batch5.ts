import type { Article } from './types';

/**
 * Batch 5 — written to a different brief from batches 1-4.
 *
 * AdSense refused the site with "Low value content" while it carried 102
 * articles, so the count was never the objection. Measuring them: the 70
 * hand-written pieces run a median of about 360 words and the 32 generated
 * ones about 429. At that length an article can state a thing but never show
 * it, and a reader who already searched the topic learns nothing new.
 *
 * These run 928-997 words — measured, not estimated — and are built to a fixed
 * shape: name the mechanism, walk one concrete case through it end to end, give
 * the rule that follows, and say plainly where the rule stops applying. No
 * article here quotes a benchmark, a price or a version number that has not
 * been checked — an invented figure would be a worse failure than a short
 * article.
 */
export const ARTICLES_BATCH5: Article[] = [
  {
    slug: 'floating-point-0-1-plus-0-2',
    category: 'languages',
    title: 'Why 0.1 + 0.2 Is Not 0.3, and What to Use for Money',
    excerpt:
      'Every language with IEEE 754 floats gets this "wrong", and it is not a bug. Here is the mechanism, the exact point where money calculations start drifting, and the three fixes worth knowing.',
    date: '2026-07-28',
    minutes: 5,
    author: 'The AXTO.dev Desk',
    sections: [
      {
        h: '',
        p: [
          'Type 0.1 + 0.2 into almost any language console and you get 0.30000000000000004. It is the most reported non-bug in programming, and the usual explanation — "floating point is imprecise" — is true but useless, because it does not tell you when it will bite you or what to do instead. The imprecision is completely deterministic. Once you can see where it comes from, you can predict exactly which calculations are safe and which are not.',
          'The short version: computers store numbers in binary, and 0.1 has no exact binary representation, in the same way that one third has no exact decimal representation. You can write 0.333… forever and never land on exactly a third. Binary has the same problem with a tenth, and the machine stops writing after a fixed number of digits.',
          'What follows is the mechanism in enough detail to reason about, the specific place it starts costing real money, and the fixes — including the one most people reach for that only hides the problem.',
        ],
      },
      {
        h: 'Where the extra digits come from',
        p: [
          'A double-precision float stores a number as a sign, an exponent, and 52 bits of fraction — the significand. Every value it can hold is some whole number of those 52-bit fractions scaled by a power of two. That set includes 0.5, 0.25, 0.75 and every other sum of halves, quarters and eighths exactly. It does not include 0.1, because a tenth is not a sum of any finite set of binary fractions.',
          'So when you write 0.1, the machine stores the closest value it can, which is very slightly more than a tenth. When you write 0.2, it stores something very slightly more than a fifth. Add the two stored values and you get something very slightly more than three tenths — and the closest storable value to that sum is not the same as the closest storable value to 0.3 written directly. The two differ in the last bit, and that last bit is what surfaces as 0.30000000000000004.',
          'This is why comparing floats with equality is unreliable while comparing them with a tolerance is not. It is also why the error is not random: run it a million times and you get the identical answer every time, on every machine that implements the standard. It is a rounding rule, not noise.',
        ],
      },
      {
        h: 'One invoice, followed to the point where it breaks',
        p: [
          'Take a shopping basket with three items at 0.10, 0.20 and 0.30 in some currency, and a system that stores prices as floats. The subtotal comes out as 0.6000000000000001. Round that for display and it shows 0.60, and everything looks fine. The trouble starts one step later, when something compares the total against a value computed a different way.',
          'Say the payment gateway is sent 0.60 and returns a confirmed amount of 0.60, and your reconciliation code checks whether the stored subtotal equals the confirmed amount. It does not — the stored one carries that trailing 1. On a single order this is a mystery ticket. Across a day of orders it is a reconciliation report that never balances, and the difference is far too small to see in any of the numbers a human looks at.',
          'The damage scales in a specific way: the error is proportional to the size of the number, so a basket of small amounts drifts by an invisible fraction, while an annual total of large amounts drifts by an amount that eventually rounds to a visible unit. Sum enough float currency values and the total is wrong by something a person can notice, with no single line item to blame.',
        ],
      },
      {
        h: 'The fix that is not a fix, and the two that are',
        p: [
          'The common instinct is to round at the end. It genuinely helps for display, and it is not enough on its own, because rounding after the fact cannot recover information the additions already lost, and because it does nothing about equality comparisons made before the rounding. Rounding is a presentation step. Treating it as a correctness step is how the reconciliation bug above survives review.',
          'The first real fix is to stop using fractions at all: store money as an integer number of the smallest unit — cents, satoshi, whatever your currency divides into — and divide only when you display it. Integers are exact, addition of integers is exact, and the failure mode changes from silent drift to overflow, which is loud and easy to test for. This is what most payment systems do internally.',
          'The second is a decimal type: a number stored in base ten rather than base two, so 0.1 is exact by construction. Most ecosystems have one, and the trade is speed and memory — decimal arithmetic runs in software rather than on the floating-point unit. For a ledger that is a fine trade. For a physics loop running millions of times a second it is not, which is the honest reason floats exist and are still the default.',
        ],
      },
      {
        h: 'When floats are exactly the right choice',
        p: [
          'None of this makes floating point a mistake. It was designed for measured quantities, where the input already carries more uncertainty than the representation adds: sensor readings, distances, physical simulation, graphics, statistics, machine-learning weights. If your input is accurate to three digits, an error in the sixteenth is not the thing to worry about, and the speed of hardware floating point is worth a great deal.',
          'The distinction that matters is not "big versus small" or "science versus business". It is whether your values are counted or measured. Counted things — money, votes, inventory, anything where a person can point at a discrepancy of one unit and call it wrong — want integers or decimals. Measured things want floats. Get that division right and most floating-point surprises stop happening.',
          'The one habit worth keeping everywhere: never compare floats with equality. Compare the absolute difference against a tolerance appropriate to your domain. Even in code where floats are the right choice, an equality check is a bug waiting for the day two paths compute the same quantity in a different order — because with floats, addition is not associative, and the order genuinely changes the answer.',
        ],
      },
    ],
  },
  {
    slug: 'browser-race-conditions-slow-connections',
    category: 'web',
    title: 'The Bugs That Only Appear on Slow Connections',
    excerpt:
      'Your app works perfectly on your laptop and breaks for one user in ten. Usually the cause is an ordering assumption that only holds when responses come back fast. Here is how to find them deliberately.',
    date: '2026-07-28',
    minutes: 5,
    author: 'The AXTO.dev Desk',
    sections: [
      {
        h: '',
        p: [
          'There is a category of front-end bug that cannot be reproduced at a desk. The report says a stale search result appeared, or a form submitted twice, or the wrong user profile flashed up for a second. On a fast connection it never happens. On a train, it happens constantly. These are race conditions, and the reason they hide is that a fast network makes responses arrive in the order they were sent — which is an accident, not a guarantee.',
          'Once you accept that responses can arrive in any order, a whole class of code reads differently. Anything that fires a request and then assumes the next thing it hears back belongs to that request is making a bet, and the bet only pays off while the network is quick.',
          'Below: the two shapes these bugs take, how to make them happen on demand, and the fixes that actually hold rather than the ones that shrink the window.',
        ],
      },
      {
        h: 'Shape one: the out-of-order response',
        p: [
          'The classic is search-as-you-type. Each keystroke fires a request; each response replaces the results list. Type "rea", then "reac", then "react", and three requests go out in that order. If the response for "rea" happens to take longer than the response for "react" — entirely possible, since they are independent requests hitting a server with varying load — it arrives last and overwrites the correct results with stale ones. The user is looking at results for a query they finished typing half a second ago.',
          'What makes this so hard to spot in review is that the code looks obviously correct. Fire request, await it, set state. The flaw is not in any one line; it is that three copies of that sequence are in flight at once and only the last one to finish gets to write. Nothing in the code expresses which one should win.',
          'The same shape appears anywhere a rapid sequence of user actions each triggers a fetch: tab switching, pagination, filter toggles, a list where each row loads its own detail. It is not specific to search.',
        ],
      },
      {
        h: 'Shape two: the double submit',
        p: [
          'The second shape is the opposite: not a response arriving too late, but a second request that should never have been sent. A user clicks Pay, nothing visibly happens because the request is still travelling, so they click Pay again. Two charges. On a fast connection the button disables and the spinner appears before a human can click twice, so the bug is invisible; on a slow one the window is a full second wide and users are trained by experience to click again when nothing happens.',
          'Disabling the button on click is the right first move and is not sufficient by itself, because it only defends the one path you thought of. A page refresh mid-request, a double-tap that fires before your handler runs, a retry from a flaky connection layer — all of them produce the same second request with the button never involved.',
          'The durable defence for anything with a side effect is idempotency at the server: the client generates a key for the operation, sends it with the request, and the server records that key and returns the original result if it sees the key again. Then a duplicate request is not something you have to prevent, only something you have to survive — a much easier property to guarantee.',
        ],
      },
      {
        h: 'Making it happen on purpose',
        p: [
          'These bugs are cheap to find once you stop waiting for them. Every major browser ships network throttling in its developer tools; set it to a slow profile and use the app normally for ten minutes, especially the parts where you type quickly or click through a list. Most ordering bugs of the first shape surface within a few minutes, because you are now typing faster than the responses can return, which is exactly the condition that triggers them.',
          'For the second shape, throttling plus deliberate impatience: click every submit button twice, quickly, on every form that changes something. If the second click can produce a second effect, you have found it. This takes minutes and it is the single highest-yield manual test on most applications.',
          'Automated coverage is possible but needs the test to control timing rather than hope for it: mock the network layer so you can resolve the second request before the first, then assert the final state matches the second. If a test cannot choose the resolution order, it is not testing the race — it is testing the happy path with extra steps.',
        ],
      },
      {
        h: 'Fixes that hold, and the one that only narrows the window',
        p: [
          'Debouncing is the fix people reach for first, and it is worth having — it cuts the number of requests, which is good for the server and good for the user. It does not solve ordering. It makes the window smaller, so the bug happens to fewer users, which is worse than not fixing it: the reports get rarer and less reproducible without ever stopping.',
          'The fix that holds is to make lateness detectable. Either cancel the previous request when a new one starts, so a superseded response never arrives at all, or tag each request and have the handler discard any response that is not the newest. Both express the missing idea directly: only the most recent request may write. Modern browsers give you a cancellation mechanism for fetch, and most HTTP clients expose one too.',
          'The general principle is worth keeping past this particular bug. Any time code sends something and then acts on what comes back, ask what happens if the answer arrives after the question stopped being relevant. On a fast connection, nothing. On a real one, that is where the bug lives — and your users are on the real one.',
        ],
      },
    ],
  },
  {
    slug: 'reading-a-stack-trace-properly',
    category: 'tools',
    title: 'Reading a Stack Trace Properly: Finding the Line That Actually Broke',
    excerpt:
      'The top frame is usually not your bug and the bottom frame is usually not either. A method for reading a trace that finds the real cause in seconds instead of minutes.',
    date: '2026-07-28',
    minutes: 5,
    author: 'The AXTO.dev Desk',
    sections: [
      {
        h: '',
        p: [
          'A stack trace is the most information you will ever get for free about a failure, and most developers skim it. The habit is understandable — it is a wall of text, most of it from libraries you did not write — but the skimming is what turns a two-minute fix into a twenty-minute one. There is a reliable order to read it in, and it is not top to bottom.',
          'A trace answers three questions: what went wrong, where the program was when it noticed, and how it got there. Those are three different things, and conflating the second with the cause is the single most common mistake. The line that threw is where the problem became visible. The line that caused it is usually several frames down.',
          'Here is a method that works across languages, because the structure of a call stack is the same everywhere even when the formatting is not.',
        ],
      },
      {
        h: 'Read the message first, and read all of it',
        p: [
          'Before any frame, read the exception type and message completely. "Cannot read property of undefined", "index out of range", "null reference" — the type alone narrows the cause enormously, because each type has a small set of ways it can arise. A null reference means something you expected to be there was not. An index error means a length assumption was wrong. Knowing which one you are dealing with tells you what to look for in the frames.',
          'The message often names the thing. "Cannot read property length of undefined" tells you the missing value was used as something with a length, so it was expected to be a string or an array. That is a real constraint on which variable it was, before you have looked at a single line number.',
          'Many traces also carry a nested cause — a "caused by" section, or a wrapped error. That inner exception is nearly always the interesting one; the outer is a library re-throwing. Read the innermost first.',
        ],
      },
      {
        h: 'Find your own code, from the top',
        p: [
          'Now scan the frames from the top and stop at the first one that is in code you wrote. Everything above it is the failure travelling through library internals, and it is rarely where your bug is — a well-used library is not usually broken, and if it is, you will find that out after you have ruled yourself out. That first frame of your own is where your code handed the library something it could not use.',
          'This single rule removes most of the wall of text. In a framework application the top ten frames are often all framework, and the first line of yours is the whole answer: you passed a value that had not loaded yet, or a callback that returns the wrong shape.',
          'Some tools do this for you by dimming or collapsing library frames. If yours does, turn it on. If it does not, the visual cue is the file path: your frames have your project paths, library frames have a package directory in them.',
        ],
      },
      {
        h: 'Then read downward for the origin of the bad value',
        p: [
          'Having found where the bad value was used, work down the stack to find where it came from. The frames below are the calls that led here, most recent first, and one of them is where the value was created or fetched. This is the part people skip, and it is the part that distinguishes fixing the cause from patching the symptom.',
          'The distinction matters concretely. If a function crashes because its argument was undefined, adding a guard at the top of that function stops the crash and leaves the caller still passing undefined — so the next thing that argument feeds will fail instead, somewhere less obvious. Following the stack down to the frame that produced the undefined lets you fix it where the data went wrong.',
          'A useful question at each frame going down: could this frame reasonably have produced the bad value? Usually two or three frames are plausible and the rest are pass-throughs. Check the plausible ones in order of how close they are to the failure.',
          'Repeated frames are their own signal. A long stretch of the same two or three functions alternating is recursion that did not terminate, and the exception at the top — a stack overflow, or an out-of-memory — is a consequence rather than a cause. Read past the repetition to the first occurrence of the cycle: the arguments at that frame are what failed to shrink, and that is the bug.',
        ],
      },
      {
        h: 'What to do when the trace points nowhere useful',
        p: [
          'Asynchronous code breaks the model, and it is worth knowing why rather than being surprised. When a callback runs later, the stack that scheduled it is gone — the trace shows the machinery that ran the callback, not the code that queued it. Most runtimes now offer async stack traces that stitch the two together; if yours does, enabling it is one of the highest-value settings you can change.',
          'Minified production code gives the same problem in a different form: real frames, unreadable names. Source maps solve it, and the trap is that a map which is not deployed alongside the build is a map that does not exist when you need it. Check that your error reporting can actually resolve a trace before you need it to, not during an incident.',
          'When a trace genuinely has nothing of yours in it — a crash entirely inside a library — the useful move is not to read harder but to widen the input. Log the arguments at the boundary where your code calls that library, reproduce, and look at what you actually sent. Nine times in ten the value is visibly wrong the moment you print it, and the trace was never going to tell you that.',
        ],
      },
    ],
  },
  {
    slug: 'why-staging-lies-to-you',
    category: 'devops',
    title: 'Why Your Staging Environment Lies to You',
    excerpt:
      'Staging passes, production breaks. The gaps that cause it are predictable and mostly fixable — and knowing which ones you cannot close is worth as much as closing the rest.',
    date: '2026-07-28',
    minutes: 5,
    author: 'The AXTO.dev Desk',
    sections: [
      {
        h: '',
        p: [
          'Staging exists to answer one question: will this break in production? When it says no and production says yes, the environment has not merely failed to help — it has actively cost you, because the team shipped with confidence it had not earned. The failures are not random. They come from a small number of systematic differences, and each one is worth knowing by name.',
          'The useful framing is that staging is a model of production, and every model is wrong in specific ways. The job is not to make it identical, which is usually impossible and always expensive. The job is to know exactly where it differs, so a green run tells you something true and you know what it does not cover.',
          'These are the differences that produce most of the surprises, roughly in order of how often they do it.',
        ],
      },
      {
        h: 'The data is not the same, and that is most of it',
        p: [
          'Production data is large, old and strange. It contains rows created by versions of your code that no longer exist, users who did things your current forms will not allow, names with characters your tests never used, and empty fields that are not supposed to be empty. Staging data is usually small, recent and created by the same code that reads it — so every assumption your code makes about its own data is satisfied by construction.',
          'This asymmetry is why performance problems almost never show up in staging. A query with no index is instant on ten thousand rows and unusable on ten million. A page that loads every record to count them is fine until the record count grows. Staging cannot warn you about either, because the volume that triggers them is the thing staging does not have.',
          'The fix that helps most is a staging dataset derived from production — anonymised, with real distributions and real volume. It is real work, and it converts the single largest category of surprise into something testable. Where it is not possible, generating data with realistic size and realistic messiness gets a useful part of the way.',
        ],
      },
      {
        h: 'The traffic is one person, not many',
        p: [
          'Everything you test in staging, you test alone. Production runs many requests at once, and concurrency creates failures that no single-user test can produce: two requests updating the same row, a cache stampede when a popular entry expires and every request rebuilds it at once, a connection pool that is ample for one user and exhausted by fifty, a background job overlapping with the request that queued it.',
          'These are not edge cases at scale — they are the normal condition of a live system, and the environment you validate in never enters it. That is why a deploy can pass every check and fall over minutes after real traffic reaches it.',
          'Load testing closes part of the gap, and even a crude version pays: fire concurrent requests at the paths that write shared state and see whether the results stay consistent. What matters is concurrency, not volume — ten simultaneous requests to the same endpoint find more concurrency bugs than a thousand sequential ones.',
        ],
      },
      {
        h: 'The configuration drifts, quietly',
        p: [
          'Staging usually starts as a copy of production and then diverges, one small change at a time: a timeout raised to make a flaky test pass, a rate limit disabled to allow test runs, a feature flag left on after an experiment, a third-party integration pointed at a sandbox that behaves more forgivingly than the real one. Each change is reasonable in isolation and nobody tracks the total.',
          'The result is an environment that is more permissive than production in ways nobody can list. Code that works in staging because a limit was raised there will fail in production against the real limit, and the failure will look inexplicable because "it works in staging" is true.',
          'Two habits keep this in check. Define both environments from the same configuration source with the differences declared explicitly, so the delta is a file somebody can read rather than a history nobody remembers. And treat every staging-only relaxation as a temporary change with a note saying why — the ones that survive a year are the ones that eventually cause an incident.',
          'Third-party sandboxes deserve particular suspicion, because they are permissive by design. A payment sandbox approves cards that a live processor would decline, a mail sandbox accepts addresses that would bounce, and neither applies the rate limits the real service enforces. Code that has only ever met the sandbox has never met the error paths that matter, which is why integration failures cluster in the first hours after a launch.',
        ],
      },
      {
        h: 'What staging cannot do, and what to use instead',
        p: [
          'Some differences are not closeable at reasonable cost. Staging will not have your production traffic pattern, your real third-party latency, or the specific mix of clients and devices your users bring. Pretending otherwise leads to spending heavily on an environment that still misses the same class of problem.',
          'The practical answer is to stop asking staging to be the last line of defence. Progressive delivery — releasing to a small share of real traffic first, watching the metrics that matter, and rolling back automatically on a bad signal — tests against the real environment, because it is the real environment. It catches precisely the things staging structurally cannot.',
          'That does not make staging worthless. It is very good at what it is good at: catching broken migrations, obvious regressions, integration mistakes and configuration errors, cheaply and before any user sees them. Use it for that, know it will not tell you about volume or concurrency, and put your confidence for those where it belongs — in the rollout, and in the ability to reverse one quickly.',
        ],
      },
    ],
  },
  {
    slug: 'when-an-ai-assistant-invents-a-function',
    category: 'ai',
    title: 'When an AI Assistant Invents a Function That Does Not Exist',
    excerpt:
      'Generated code that calls a plausible, non-existent API is the failure mode most likely to reach your main branch. Why it happens, why it survives review, and the checks that catch it.',
    date: '2026-07-28',
    minutes: 5,
    author: 'The AXTO.dev Desk',
    sections: [
      {
        h: '',
        p: [
          'Of everything an AI coding assistant gets wrong, the invented API is the one most likely to survive to production. Not because it is hard to detect — a missing function fails immediately — but because of what it does to the reviewer. Wrong logic looks wrong if you read it carefully. A call to a method that sounds exactly like the method that should exist looks right to everyone, including the person who knows the library.',
          'It is worth understanding why the model does this, because the reason tells you where it will happen most and what kind of check actually catches it.',
          'This is not an argument against using these tools. It is an argument for knowing their specific failure shape, which is what lets you use them fast and safely at the same time.',
        ],
      },
      {
        h: 'Why a plausible name is the most likely output',
        p: [
          'A language model produces the most likely continuation of the text so far, trained across an enormous amount of public code. Libraries in a given ecosystem name things in consistent ways: a thing that fetches by identifier is often getById, a thing that converts is often toSomething, options usually go in a trailing object. Those patterns are strong, and the model has learned them thoroughly.',
          'So when a real method for a task is missing from what the model can recall, the most likely next tokens are still a name shaped like that library names things. The output is not a random guess — it is the name the library would most plausibly have used, which is exactly what makes it convincing. The model is not lying; it has no mechanism for distinguishing a name it has seen from a name that fits the pattern.',
          'This predicts where it happens most: on smaller or newer libraries where there is less material, on recently changed APIs where the model has learned an older shape, and at the boundary between two similar libraries whose conventions the model may blend.',
        ],
      },
      {
        h: 'Why review does not catch it',
        p: [
          'Code review is good at catching logic that does not follow and bad at catching names that do. A reviewer reading a call to a well-named method makes the same inference the model did: this is what the method would be called, so this is the method. Familiarity makes it worse rather than better — someone who uses the library daily has the strongest expectation about what it should contain.',
          'The type checker is the natural defence and it has a specific hole: it only helps where types are known. In a strictly typed codebase against a fully typed library, an invented method fails to compile, and the problem is essentially solved. Where the value is untyped, or dynamically constructed, or the library ships no types, nothing objects until runtime.',
          'The other hole is coverage. Generated code frequently lands in error branches, retry paths and edge cases — exactly the places tests are thinnest, and exactly the places nobody exercises by hand. A hallucinated call in a catch block can sit in main for months and then fire on the day something else already went wrong.',
        ],
      },
      {
        h: 'The checks that actually work',
        p: [
          'The most effective habit is the cheapest: for every unfamiliar call in generated code, look it up in the real documentation before accepting it. Not a search that surfaces a blog post — the library\'s own reference, or its type definitions, or its source. This takes seconds per call and it is the only check that catches the case where everything else passes.',
          'Structurally, three things pay for themselves. Run the code, including the branches the assistant wrote, before merging — a generated retry path that never executes is not reviewed, it is only read. Prefer typed interfaces at the boundary, so the checker can object. And keep the assistant working in small pieces you can verify, rather than accepting a large block whose middle nobody reads.',
          'A useful tell: an invented method often has a slightly better name than the real one. Real APIs carry history — awkward names kept for compatibility, an inconsistent argument order, a verb that made sense in an older version. When generated code reads more cleanly than the library usually does, that is worth a lookup.',
          'The near miss is worth naming separately from the invention, because it fails differently. A method that genuinely existed two major versions ago will be missing today, and the assistant produced it from material written when it was real. Here the documentation search succeeds and misleads, because it finds the old page. Check that what you are reading matches the version in your lockfile, not merely that it exists somewhere.',
        ],
      },
      {
        h: 'The line worth holding',
        p: [
          'The rule that survives all of this is simple to state and genuinely hard to keep: do not merge code you could not have written yourself. Not "would not have" — plenty of generated code is better than what you would have typed. Could not: if you cannot explain what a line does and why it is correct, you cannot debug it, and it will eventually need debugging, probably at the worst time.',
          'Applied honestly this does not slow you down much, because it does not require writing the code yourself. It requires reading it properly once, which is a fraction of the time the tool saved. The developers who get the most out of these assistants are not the ones who trust them least or most, but the ones who read the output at the speed it deserves.',
          'And it is worth being clear about the upside, because the failure mode is not an argument against the tool. For repetitive transformations, first-draft tests, explaining an unfamiliar codebase, or sketching an approach before committing to it, an assistant is genuinely fast and genuinely good. The invented function is a known, bounded, checkable risk — which is the best kind to have.',
        ],
      },
    ],
  },
  {
    slug: 'character-encoding-why-names-break',
    category: 'languages',
    title: 'Character Encoding: Why Names Break and One Emoji Counts as Two',
    excerpt:
      'Mojibake, a length that disagrees with itself, and a truncation that corrupts the last character. All three come from the same confusion between bytes, code points and what a reader sees.',
    date: '2026-07-28',
    minutes: 5,
    author: 'The AXTO.dev Desk',
    sections: [
      {
        h: '',
        p: [
          'Three bugs, one cause. A user\'s name arrives as a row of question marks. A string of one emoji reports a length of two. A field truncated to fit a database column ends in a broken character that no font can draw. Each looks like a separate problem and each is the same misunderstanding: treating bytes, code points and visible characters as if they were the same thing.',
          'They are three distinct layers, and text handling only becomes predictable once you know which layer each piece of your code is working at. Most languages blur the distinction in their default string type, which is convenient right up until it is not.',
          'What follows is the three layers, then each of the three bugs traced to the layer it comes from, then the small set of rules that prevent all of them.',
        ],
      },
      {
        h: 'Bytes, code points, graphemes',
        p: [
          'A byte is eight bits — the unit files and networks actually move. A code point is one entry in the Unicode catalogue: a letter, a mark, a symbol, identified by a number. A grapheme is what a reader would call one character: possibly one code point, possibly several combined. These three counts are equal only for plain unaccented English text, which is why so much code appears to work until it meets a real name.',
          'UTF-8, the encoding almost everything uses now, maps code points to bytes with a variable length. An ASCII character takes one byte; most accented Latin, Greek and Cyrillic take two; most CJK characters take three; emoji take four. So a string\'s byte length and its code-point count are different numbers, and neither is the number a user would give you if you asked how many characters they typed.',
          'The third layer is where it gets genuinely subtle. A single visible emoji can be several code points joined together — a base symbol plus a skin-tone modifier, or several symbols joined by an invisible connector to form one glyph. A letter with an accent may be one code point or two, depending on how the text was produced, and the two forms look identical.',
        ],
      },
      {
        h: 'Bug one: the row of question marks',
        p: [
          'Mojibake — text decoded with the wrong encoding — happens when bytes written as UTF-8 are read as something else, or the reverse. The bytes are intact; the reader is applying the wrong table. The reason it survives so long in a system is that it usually only affects a minority of records, because ASCII bytes are identical in UTF-8 and in most legacy encodings. Every English-only name passes through cleanly and only the accented ones corrupt.',
          'The corruption is often not recoverable, and this is the part worth understanding. If the wrong decoding maps some byte sequence to a replacement character, the original bytes are gone the moment that string is written back. Data corrupted this way and re-saved cannot be repaired from the stored value — only from a backup or the original source.',
          'The cause is nearly always a boundary with an unstated encoding: a database connection, a file read, an HTTP response without a charset, a terminal. Each of those has a default, the defaults differ, and the one that does not match is the one that corrupts.',
        ],
      },
      {
        h: 'Bugs two and three: the wrong length, the broken tail',
        p: [
          'When a one-emoji string reports a length of two, the language is telling you a count from a layer you did not mean. Several major languages store strings as UTF-16 and report length in those units, so a code point above a certain range counts as two. The number is correct for what it measures; it is simply not the number of characters, and it is not the number of bytes either. Validating a user\'s input against a character limit with that count rejects legitimate text and accepts text that is too long for the column.',
          'Truncation is the same error with worse consequences. Cutting a string at a fixed count of bytes can land in the middle of a multi-byte character, leaving a fragment that is not valid text — which then breaks whatever reads it, sometimes far away and much later. Cutting at a fixed count of code points is safe at the byte level but can still split a grapheme, severing an accent from its letter or a modifier from its emoji.',
          'The rule that follows: decide which layer your limit is about. A database column limit is about bytes. A "maximum 200 characters" shown to a user is about graphemes. A protocol field may be about code points. Measure and cut at the layer the limit belongs to, and use a library that understands grapheme boundaries when the answer needs to match what a person sees.',
        ],
      },
      {
        h: 'The rules that prevent all three',
        p: [
          'Declare UTF-8 explicitly at every boundary, and never rely on a default. The database connection, the table and column collation, the file read, the HTTP Content-Type, the terminal, the source files themselves. A default that happens to be right today is a default that changes when the code runs somewhere else — and the failure will appear as a data problem, not a configuration one.',
          'Decode once at the edge, work with text in the middle, encode once on the way out. Most encoding bugs are a value decoded twice or not at all, which is far easier to avoid when there is exactly one place in the system where bytes become text and one where the reverse happens.',
          'And test with text that has all three layers disagreeing. Put a name with combining accents, a CJK string and a multi-code-point emoji into your fixtures and let them flow through every path that stores, truncates, measures or displays. It costs one line in a fixture file and it turns an entire category of production bug into a failing test.',
        ],
      },
    ],
  },
];
