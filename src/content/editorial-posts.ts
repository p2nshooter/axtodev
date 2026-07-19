/**
 * Editorial posts — original long-form articles shipped WITH the codebase
 * (no database dependency), merged into the /blog listing alongside any
 * admin-authored prisma posts. Written from the marketplace's own domain:
 * legal e-books, public-domain publishing, licensing, and digital reading.
 */

export interface EditorialPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  minutes: number;
  content: string; // plain text, blank-line paragraphs; "## " lines = headings
}

export const EDITORIAL_POSTS: EditorialPost[] = [
  {
    slug: "public-domain-explained",
    title: "The Public Domain, Explained: What You May Legally Read, Copy, and Sell",
    excerpt:
      "Millions of great books belong to everyone. Here is how works enter the public domain, how to verify status, and why 'free online' is not the same thing.",
    date: "2026-07-02",
    minutes: 7,
    content: `Copyright is a temporary monopoly. When it expires, the work enters the public domain — owned by no one, usable by everyone, for any purpose including commercial sale. That single fact powers a large part of the legitimate e-book economy, and misunderstanding it powers most of the illegitimate one.

## How works get there

The common routes are expiry (in most countries, life of the author plus 70 years; in the United States, publications before 1929 are public domain as of 2026), dedication (the author explicitly waives rights, e.g. CC0), and ineligibility (works of the U.S. federal government, mere facts and ideas).

## The traps

Translations are separately copyrighted: Tolstoy is public domain, but a 1998 English translation of Tolstoy is not. New editions can add protected material — introductions, annotations, cover art — even when the underlying text is free. And availability is not status: a book being downloadable somewhere says nothing about its legality. 'I found it online' has never been a license.

## How a careful seller verifies

Check the author's death year against the term rule of each market you sell into. Check the specific edition — text, translation, artwork — not just the title. Keep a provenance note per title: source, basis for public-domain status, date checked. That note is the difference between a catalog and a liability.

Public domain is not a loophole. It is the deal society made with authors: protection for a time, then a permanent gift to everyone. Selling well-made editions of that gift — carefully verified, honestly described — is not merely legal. It is the system working as designed.`,
  },
  {
    slug: "plr-mrr-licenses-guide",
    title: "PLR, MRR, Royalty-Free: A Plain-Language Guide to Resale Licenses",
    excerpt:
      "Three acronyms cause endless confusion in digital publishing. What each license actually permits, and the red flags that mean walk away.",
    date: "2026-07-04",
    minutes: 6,
    content: `Beyond the public domain, a second lane of legal e-book commerce runs on explicit licenses. The acronyms are ugly; the concepts are simple.

## The three licenses

PLR (Private Label Rights) is the broadest: you may typically edit the work, rebrand it, claim authorship per the license terms, and sell it. MRR (Master Resale Rights) lets you sell the work AND pass resale rights to your buyer, but usually without modification rights. Plain resale/royalty-free licenses let you sell the unmodified work, keeping 100% of revenue, with no rights flowing to your customer.

## What to verify before buying any of them

Read the actual license document, not the sales page. Confirm the seller had the right to grant it — a license from someone who never owned the work is void. Check restrictions that commonly hide in the fine print: minimum pricing, prohibited platforms, no-giveaway clauses. And archive the license with your purchase receipt; if a dispute ever comes, the paper trail is the defense.

## Red flags that mean walk away

Current bestsellers offered with 'resale rights' (nobody licenses those); prices too low to be plausible for the rights claimed; sellers who cannot name the original author or copyright basis; licenses that contradict themselves. The rule of thumb of every honest marketplace, ours included: if the provenance cannot be documented, the title does not go in the catalog.

Licensed resale is a real, legal business model — the wholesale tier of digital publishing. Treat the license as the product, because legally speaking, it is.`,
  },
  {
    slug: "why-legal-ebooks-matter",
    title: "Why 'Only Legal E-Books' Is a Feature, Not a Slogan",
    excerpt:
      "Pirate catalogs are bigger and cheaper. Here is what a legal-only catalog buys you: safety, quality, permanence — and a clear conscience.",
    date: "2026-07-06",
    minutes: 6,
    content: `Any e-book store can be large if it does not ask where its files came from. Choosing to sell only verifiable-rights titles — original works, public domain, documented licenses — is a constraint. It is also the entire point.

## What buyers get

Files that are safe: pirate e-book files are a classic malware channel, and 'free' PDFs routinely carry more than the novel. Files that persist: purchases from gray-market stores vanish when the store does, which is often; a legal catalog does not live one takedown notice from oblivion. And quality: legitimate editions are proofread, formatted, and complete — the pirate copy of a classic is frequently a broken OCR of a different edition than advertised.

## What authors get

For original and licensed works, revenue flows to whoever holds the rights — which is what keeps new books being written. Even for public-domain titles, legal editions compete on craft (introductions, typography, translation quality) rather than on theft, which pushes the whole market toward better books.

## What the store owes you in return

A legal-only promise is checkable. Every title should answer one question on demand: by what right is this sold? Original, public domain with the basis stated, or licensed with the license held on file. That is the standard our content policy codifies, and the standard any store asking for your money should meet.

Cheap and infinite is easy. Legal, safe, and permanent is a feature — the one the others depend on.`,
  },
  {
    slug: "ebook-formats-epub-pdf-guide",
    title: "EPUB, PDF, MOBI: Choosing the Right E-Book Format (and Why It Matters)",
    excerpt:
      "Formats decide how your book behaves on every screen you own. A practical guide to what to download and when.",
    date: "2026-07-08",
    minutes: 6,
    content: `An e-book format is a decision about what should stay fixed and what should adapt. Every practical difference follows from that.

## EPUB: the adaptable standard

EPUB is reflowable: text resizes, reflows, and restyles to fit any screen, which makes it the right default for novels and most non-fiction on phones, tablets, and e-readers. Modern EPUB3 handles images, footnotes, and even audio. If a store offers EPUB, take it — it is the format most likely to still open beautifully in twenty years.

## PDF: the faithful page

PDF preserves the page exactly: layout, fonts, diagrams, margins. That fidelity is essential for textbooks, illustrated works, sheet music, and anything where 'page 47' must mean the same thing for everyone — and it is why PDFs fight you on a phone screen. Choose PDF when layout IS the content.

## MOBI and the Kindle question

MOBI is Amazon's legacy format, effectively retired: modern Kindles accept EPUB via Send-to-Kindle. Unless you run a decade-old device, you no longer need MOBI at all.

## Practical advice for buyers

Prefer stores that sell without DRM lock-in and offer more than one format — you are buying the book, not a cage for it. Keep your own backup copy of purchases. And for reading apps, anything that opens standard EPUB keeps your library portable across every device you will ever own. Formats come and go; a well-kept EPUB library is forever.`,
  },
  {
    slug: "self-publishing-rights-basics",
    title: "Self-Publishing? The Five Rights Questions to Answer Before You Hit Publish",
    excerpt:
      "Most first-time publishing disasters are rights disasters. Five questions that take an hour now and save a lawsuit later.",
    date: "2026-07-10",
    minutes: 7,
    content: `The writing is the hard part — but the rights are the dangerous part. Before publishing any e-book, yours or assembled from licensed material, answer five questions in writing.

## 1. Do I own or control every word?

Your own prose, yes. Quotations beyond brief attributed excerpts, song lyrics (famously enforced), long passages from other works — each needs permission or a solid public-domain basis. 'Fair use' is a defense argued in court, not a license you can rely on in advance.

## 2. Do I control every image?

Covers sink more independent books than texts do. A photo found in search results is someone's property. Use your own work, properly licensed stock (keep the receipt), or verified public-domain art — and note that a museum's photograph of an old painting can carry its own claims in some jurisdictions.

## 3. Are real people described safely?

Memoir and nonfiction can defame; even fiction can if a character is recognizably a real person portrayed damagingly. The test is not your intent but what a reader could identify.

## 4. Is the title and branding clear?

Titles are not copyrightable, but series names and logos can be trademarks. A two-minute trademark search before you commit to branding is the cheapest insurance in publishing.

## 5. Can I prove all of the above?

Keep a rights file per book: licenses, permissions, sources, dates. Distributors and stores increasingly ask; when they do, the publishers with paperwork keep selling and the rest get delisted.

Answer all five and publishing becomes what it should be: a craft, not a gamble.`,
  },
  {
    slug: "digital-library-organizing",
    title: "Owning Your Digital Library: Backups, Formats, and Not Losing Books You Paid For",
    excerpt:
      "People who would never throw away a paper book lose digital ones constantly. A simple system for a library that outlives every device and store.",
    date: "2026-07-12",
    minutes: 5,
    content: `A paper library survives by sitting on a shelf. A digital library survives only on purpose. The purpose takes about an evening to set up.

## Download everything, always

A purchase that exists only inside a store's app is a lease with extra steps. Whenever a store offers file downloads — as any store respecting its customers does — take them at purchase time and put them in one place. One folder tree, organized by author or genre, beats every clever app that may not exist in five years.

## The 3-2-1 rule, book edition

Three copies (working copy, local backup, cloud or offsite backup), two different media, one away from home. For a library measured in megabytes this costs nearly nothing — the entire written canon of your life fits on the cheapest drive sold today.

## Prefer portable formats

Standard EPUB and PDF open everywhere, forever. Files locked to a single vendor's DRM are the ones people lose when accounts close, regions change, or companies fold. Buy DRM-free when you can; where you cannot, keep the store receipts — proof of purchase has resurrected more than one lost library.

## Catalog lightly

A simple spreadsheet — title, author, format, source, date — turns a folder of files into a library you can actually browse. Ten seconds per book at purchase; hours saved every time you wonder 'do I already own this?'

You went to the trouble of buying books legally. Go to the small extra trouble of making sure they stay yours.`,
  },
  {
    slug: "reading-more-books-habits",
    title: "How People Who Read 50 Books a Year Actually Do It",
    excerpt:
      "It is not speed reading and it is not free time you don't have. The mechanics of high-volume reading, minus the mythology.",
    date: "2026-07-14",
    minutes: 6,
    content: `Heavy readers are not faster than you and they are not less busy. They have simply removed the friction between themselves and the next page — usually in the same handful of ways.

## They always have the book with them

The decisive habit is availability: the current book on the phone that is already in the pocket. Waiting rooms, queues, commutes — heavy readers convert scraps of dead time that others spend scrolling. Twenty minutes of scraps a day is 120 hours a year: thirty books, from time you never noticed owning.

## They quit bad books without ceremony

Nothing kills annual volume like a dutiful slog. The fifty-book reader abandons without guilt around page 50 and opens the next one; the book was auditioning, not the reader.

## They read several books at once

One demanding book, one light one, one audiobook or narrated e-book for hands-busy time. Matching the book to the moment means there is always a book that fits — so reading happens instead of waiting for perfect conditions.

## They end sessions mid-chapter

Stopping at a cliffhanger, even a small one, makes the next pickup effortless. Clean chapter endings are where books get quietly abandoned.

## They keep the pipeline full

A wishlist or loaded library removes the between-books gap where momentum dies. Finish at midnight, start the next by 12:04.

None of this is talent. It is logistics — and logistics can be copied this week.`,
  },
  {
    slug: "crypto-payments-ebooks",
    title: "Paying for E-Books With Crypto: How It Works and When It Makes Sense",
    excerpt:
      "Stablecoins and lightning-fast settlement have made crypto checkout genuinely useful for digital goods. A sober look at how it works here.",
    date: "2026-07-16",
    minutes: 5,
    content: `Digital goods and digital money are a natural pair: nothing ships, nothing clears customs, and settlement can be as fast as the download. Here is the sober version of how crypto checkout works for e-books and when to prefer it.

## The mechanics

At checkout you pick a currency — BTC, ETH, BNB, SOL, DOGE, or a stablecoin like USDT — and the store quotes a live-rate amount with a payment address, valid for a short window. You pay from any wallet; confirmations land in seconds to minutes depending on the chain; the order completes like any card purchase. Live-rate quoting matters: it means the store, not you, absorbs the volatility during the payment window.

## When it genuinely helps

Cross-border buyers whose cards fail on foreign merchants; readers in countries poorly served by the card networks; privacy-conscious buyers who prefer not to spread card numbers across small merchants; and anyone already holding stablecoins, for whom a $9 e-book is a ten-second transfer with no FX fee.

## The honest caveats

On-chain payments are final — check the address and amount, because there is no chargeback. Network fees on some chains can be silly for small purchases (stablecoins on cheap networks solve this). And taxes on spending appreciated coins are your jurisdiction's business, not the store's.

Crypto will not replace cards for everyone. But for the growing slice of readers it serves, it turns 'my payment failed' into 'my book is downloading' — which is the only metric a checkout has.`,
  },
  {
    slug: "brief-history-of-ebooks",
    title: "A Brief History of the E-Book: From Index Cards to Your Pocket",
    excerpt:
      "The e-book is older than the web. A tour from Project Gutenberg's first typed text to the reflowable libraries of today.",
    date: "2026-07-18",
    minutes: 6,
    content: `In 1971, a student with spare mainframe time typed the United States Declaration of Independence into a computer and posted it for anyone to copy. Michael Hart's gesture became Project Gutenberg, and the e-book was born — twenty years before the web existed to distribute it.

## The slow decades

For thirty years digital books were plain-text curiosities read by hobbyists on terminals. The pieces assembled gradually: the PDF (1993) made documents portable; early handhelds proved people would read on screens; and public-domain volunteers quietly built the first digital libraries while publishers looked away.

## The decade everything changed

Between 2006 and 2010, e-ink devices made screen-reading restful, the smartphone put a bookstore in every pocket, and EPUB standardized the reflowable book. Sales exploded — and so did the disputes that still shape the market: pricing wars, DRM debates, and the question of whether you buy a digital book or merely rent it.

## Where we actually landed

The paper-versus-pixels war ended in coexistence: print holds gift books and picture books; digital dominates convenience, backlists, niche publishing, and — through self-publishing — authorship itself, with more titles released now than at any point in history. The e-book's real revolution was never the screen. It was distribution: any book, anywhere on earth, in seconds — including the entire public domain, free, exactly as a student with a mainframe intended.`,
  },
  {
    slug: "speed-reading-myths-and-truths",
    title: "Speed Reading: The Myths, the Physiology, and What Actually Helps",
    excerpt:
      "Courses promise 1,000 words per minute with full comprehension. Eye-movement research says otherwise — but real gains do exist.",
    date: "2026-07-19",
    minutes: 6,
    content: `The pitch is seductive: unlock the reading speed schools suppressed, absorb a book at lunch. The physiology, unfortunately, has opinions.

## What the eye allows

Reading proceeds in fixations — brief stops during which the eye takes in a narrow window of text. Vision outside that window is too blurry for word recognition; no training enlarges the retina. Comprehension studies of extreme speed readers keep finding the same result: past roughly double a strong natural pace, understanding collapses toward skimming-level guesswork.

## The myths, specifically

Eliminating subvocalization (the inner voice) mostly eliminates comprehension of complex prose — the voice is part of how syntax gets parsed. Reading whole pages in a glance is photographic-memory folklore. And comprehension-preserving 1,000 wpm claims have repeatedly failed controlled testing.

## The gains that are real

Ordinary readers DO harbor real speed upside: reducing regressions (needless re-reading of lines already understood), previewing structure so the brain knows where the argument is going, and matching gear to material — cruising through familiar exposition, slowing for dense argument. Skimming itself is a legitimate skill when chosen consciously: surveying a book to decide WHETHER to read it deserves speed.

## The uncomfortable truth

The readers who finish fifty books a year do not read faster. They read more often, quit bad books sooner, and choose better. Time-in-pages beats words-per-minute — and unlike the retina, time responds to habit.`,
  },
  {
    slug: "art-of-annotating-books",
    title: "Marginalia in the Digital Age: The Art of Annotating What You Read",
    excerpt:
      "Highlights you never revisit are decoration. How readers from Darwin to today turn marking into thinking.",
    date: "2026-07-20",
    minutes: 6,
    content: `Great readers have always defaced their books. Darwin's margins argue with authors; medieval scholars glossed their manuscripts into palimpsests. Annotation is not note-taking beside reading — it IS reading, made visible.

## Why marking works

Passive highlighting barely helps memory, and research says so. What works is elaboration: restating a claim in your own words, objecting, connecting to something else you know. The pen (or keyboard) forces the restatement; the restatement forces the understanding. A margin question mark that you later answer teaches more than a page of yellow stripes.

## A simple system that scales

Keep marks cheap and layered: underline the claim, star the genuinely important, question-mark the doubtful, and write one honest sentence at each chapter end — what did this chapter actually say? Those chapter sentences, collected, become a summary you wrote without noticing.

## Digital advantages worth using

E-book annotation adds what paper never could: search across every note you have ever made, export of highlights into your own files, and marks that survive lending, moving, and second copies. The exported-highlights review — rereading your notes a week later and keeping only what still matters — is where fleeting impressions become durable knowledge.

## The permission slip

Some readers still feel books are too sacred to mark. Consider the reversal: an unmarked book leaves no evidence you were there. The conversation in the margins is the reader's half of authorship — and in digital editions, not even the paper objects.`,
  },
  {
    slug: "where-to-start-with-classics",
    title: "Where to Start With the Classics (Without Pretending to Enjoy Suffering)",
    excerpt:
      "The classics are free, abundant — and intimidating. An honest on-ramp that begins with pleasure instead of duty.",
    date: "2026-07-21",
    minutes: 7,
    content: `The classics carry a double reputation: essential and unreadable. Both halves are propaganda. The canon is simply the books readers kept choosing after the marketing died — which means it is full of page-turners wearing respectable covers.

## Start where the pleasure is proven

Adventure has aged best: The Count of Monte Cristo is a revenge thriller, Treasure Island a perfect machine, Sherlock Holmes the template for every detective since. Wit survives too — Austen's Pride and Prejudice remains genuinely funny, Wilde still lands every line. Horror's founders — Dracula, Frankenstein, Jekyll and Hyde — read faster than their imitators.

## The translation caveat

For works in translation, the translator IS the experience. A stiff Victorian rendering can bury a lively original; a modern translation can resurrect it. Sample before committing — public-domain status means multiple translations often exist, and choosing well matters more than trying harder.

## Permission slips

Abridgment is not a sin for a first pass at the doorstoppers. Audio counts — these books were mostly read aloud in their own era. Quitting counts too: bouncing off one classic says nothing about the other thousand. And chronology is not a syllabus; nobody must earn Dickens by first surviving epics they did not choose.

## Why bother at all

Beyond pleasure, the classics are the shared reference layer of everything written since — read a handful and half of modern culture starts winking at you. And every one of them is in the public domain: the entire foundation of literature, legally free, one download away.`,
  },
  {
    slug: "drm-explained-for-readers",
    title: "DRM Explained: What That Lock on Your E-Book Actually Does",
    excerpt:
      "Digital rights management shapes what you can do with books you paid for. How it works, why it exists, and how to buy wisely.",
    date: "2026-07-22",
    minutes: 6,
    content: `Buy a paper book and it is unambiguously yours — lend it, resell it, read it in any chair. Buy some e-books and a technology called DRM (digital rights management) quietly rewrites the deal.

## What DRM does

DRM encrypts the book file so that only authorized software, tied to your account, can open it. The intent is piracy prevention; the side effects land on paying customers: books locked to one vendor's apps, lending restricted or impossible, and libraries that evaporate when an account closes, a region changes, or a store shuts down — all of which have happened, repeatedly, to real readers.

## The case for and against

Publishers argue DRM protects authors' income, and for high-piracy categories there is something to it. The counterargument is empirical: pirates strip DRM in minutes, so the lock mostly inconveniences the honest — while teaching them that buying legally delivers LESS ownership than piracy would. Many successful publishers now sell DRM-free on exactly that logic: treat buyers as customers, not suspects.

## Buying wisely

Before purchasing, learn which kind of store you are in. DRM-free stores sell you a file: back it up, convert formats, keep it forever. DRM stores sell you access: fine for disposable reads, risky for a permanent library. Watermarked (social) DRM is the middle path — an invisible purchase stamp, no locks. A store that says plainly what you get, keeps its catalog legal, and lets you download your files is making you an owner. That is the standard worth paying for.`,
  },
  {
    slug: "building-a-personal-canon",
    title: "Beyond the Bestseller List: Building a Personal Reading Canon",
    excerpt:
      "Algorithms feed you what everyone reads. A method for choosing books that compound into something distinctly yours.",
    date: "2026-07-23",
    minutes: 6,
    content: `Bestseller lists answer one question: what is everyone buying this month? A personal canon answers a better one: which books, together, make your thinking more yours?

## The compounding principle

Books multiply when they connect. Three scattered novels entertain three times; three books circling one obsession — the sea, betrayal, how cities work — start talking to each other, and the reader becomes the room where the conversation happens. Choose clusters, not just titles.

## Sources better than charts

Follow the bibliography: the books your favorite authors cite are pre-filtered by someone whose judgment you already trust. Follow the decades: what survived fifty years survived for reasons; the public domain is a bestseller list scored by time. Follow your annotations: the margins where you argued most are pointing at your next cluster.

## The keeping and the culling

A canon needs a shelf — physical or digital — separate from the everything-pile: the books you would replace if lost, reread on purpose, and press into friends' hands. Review it yearly; demote without guilt. The discipline is the point: knowing WHY each book earned its place is a portrait of your own mind, updated annually.

## Why it matters now

When recommendation engines optimize for what people like you clicked, reading identically becomes the default. A deliberate canon is quiet resistance — the difference between having read things and having become someone by reading them.`,
  },
  {
    slug: "supporting-indie-authors",
    title: "How Readers Actually Move the Needle for Independent Authors",
    excerpt:
      "Indie authors live or die on reader actions that cost nothing. The five that matter, ranked by real impact.",
    date: "2026-07-24",
    minutes: 5,
    content: `Behind every independent e-book is an author doing the jobs a publishing house would staff: editing, covers, marketing, all of it. Which means ordinary readers hold unusual power — specific, free actions that visibly change an indie book's fate.

## Ranked by impact

One: reviews, even two sentences. Store algorithms gate visibility behind review counts, and the difference between four reviews and forty is the difference between invisible and discoverable. Honest and short beats polished and never-written.

Two: finishing and buying the next one. Series continuation is the metric indie careers are built on; the sequel purchase tells every algorithm the author is worth showing.

Three: the personal recommendation. One reader pressing a book on one friend outperforms most paid advertising — and unlike advertising, it compounds.

Four: wishlists, follows, and preorders. These queue signals tell platforms an audience is waiting, and platforms reward evidence.

Five: buying where the author keeps more. The same book often earns the author dramatically different amounts by storefront; direct and indie-friendly marketplaces send more of your money to the person who wrote the words.

## The mindset shift

None of this is charity. Indie publishing is where genres experiment first and where voices without connections get their shot; readers who engage are stocking their own future shelves. The five actions above are simply the reader's side of a very old bargain: authors make the stories, readers make the careers.`,
  },
  {
    slug: "reading-slumps-recovery",
    title: "The Reading Slump: Why It Happens and How Readers Recover",
    excerpt:
      "Every reader eventually stalls — weeks where no book sticks. The mechanics of slumps and the gentle exits that work.",
    date: "2026-07-25",
    minutes: 5,
    content: `It happens to devoted readers most of all: suddenly every book feels like homework, the pile glares from the nightstand, and a month disappears without a finished chapter. The slump is not a character flaw. It is usually mechanical — and mechanically fixable.

## The usual causes

A book mismatch you refuse to admit: the current title bores you, but quitting feels like failure, so reading itself takes the blame. Depletion: stressful seasons shrink the attention reading spends. Overshoot: after a masterpiece, everything else tastes flat. And obligation creep: when every book is for growth or work, the appetite quietly leaves.

## The exits that work

Declare bankruptcy on the current book — put it away without ceremony; it will wait. Return to a known pleasure: rereading an old favorite rebuilds the habit on guaranteed enjoyment, which is why comfort rereads dominate slump recoveries. Shrink the unit: one chapter, even one page, counts; momentum outranks volume. Change the channel: audio during walks often restarts a stalled reader precisely because it feels like cheating. And lower the stakes: read something purely fun and admit no one is grading you.

## The reframe

A slump usually marks a transition — the reader you were finishing, the reader you are becoming not yet stocked. Treat it as a browsing season: sample widely, quit freely, follow curiosity without commitment. Appetite returns the way it always left: one book that suddenly will not let go.`,
  },
];

export function getEditorialPost(slug: string): EditorialPost | undefined {
  return EDITORIAL_POSTS.find((p) => p.slug === slug);
}
