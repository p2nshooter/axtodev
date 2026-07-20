/**
 * The AXTO.dev free reading library — e-book length "Reader's Companions" to
 * great public-domain works, written originally for this site (no copied text,
 * no scraped content: every chapter is our own commentary and retelling, which
 * is what keeps the site useful to readers and safe for AdSense).
 *
 * Everything here is FREE to read and listen to, with no account. The catalog
 * lives in code so every page can be prerendered as a static asset — served
 * straight from the CDN with zero per-request compute (the Error-1102 fix).
 */

export interface EbookChapter {
  title: string;
  paragraphs: string[];
}

export interface Ebook {
  slug: string;
  title: string;
  subtitle: string;
  basedOn: string; // the public-domain work this companion is about
  author: string; // original author of the classic
  era: string;
  categorySlug: CategorySlug;
  minutes: number;
  description: string;
  chapters: EbookChapter[];
}

export type CategorySlug = 'belajar-dasar' | 'kursus-skill' | 'bisnis-keuangan' | 'expert-mastery';

export const LIBRARY_CATEGORIES: Array<{ slug: CategorySlug; name: string; description: string }> = [
  {
    slug: 'belajar-dasar',
    name: 'Foundations',
    description: 'Timeless first principles of character, thought, and self-mastery — the reading that everything else builds on.',
  },
  {
    slug: 'kursus-skill',
    name: 'Skills & Practice',
    description: 'Practical courses in attention, time, and learning — read them, then use them the same day.',
  },
  {
    slug: 'bisnis-keuangan',
    name: 'Money & Work',
    description: 'The old, unglamorous truths about earning, saving, and building — from thinkers who lived them.',
  },
  {
    slug: 'expert-mastery',
    name: 'Strategy & Mastery',
    description: 'Deep companions to the great books of strategy, leadership, and wisdom literature.',
  },
];

export const LIBRARY: Ebook[] = [
  {
    slug: 'art-of-war-companion',
    title: 'The Art of War: A Working Reader’s Companion',
    subtitle: 'What Sun Tzu actually teaches, chapter by chapter, for people who compete for a living',
    basedOn: 'The Art of War',
    author: 'Sun Tzu',
    era: '5th century BC',
    categorySlug: 'expert-mastery',
    minutes: 14,
    description:
      'The most quoted strategy book in history is also the most misread. This companion walks the thirteen chapters in plain language — what they meant on ancient battlefields and what they mean in a negotiation, a market, or a career.',
    chapters: [
      {
        title: 'Why a 2,500-year-old war manual survived',
        paragraphs: [
          'The Art of War endures for one reason: it is not really about war. It is about conflict under scarcity — any situation where two parties want incompatible things and resources are finite. That is a job market, a lawsuit, a product launch, a chess game. Sun Tzu wrote the first book that treated conflict as a system that can be studied, rather than a stage for heroism.',
          'Its core claim is stated in the third chapter and it is still shocking: the supreme excellence is not winning a hundred battles; it is subduing the enemy without fighting. Every other idea in the book — deception, positioning, speed, intelligence — serves that inversion. The best strategist looks passive precisely when they are working hardest.',
        ],
      },
      {
        title: 'Calculation before commitment',
        paragraphs: [
          'The opening chapter, "Laying Plans," is an accounting exercise. Sun Tzu lists five factors — moral influence, weather, terrain, command, doctrine — and says victory can be predicted by comparing them honestly before anyone moves. The discipline being taught is not cleverness; it is the courage to count.',
          'Modern readers should notice what is missing: passion, destiny, momentum. Sun Tzu treats enthusiasm as noise. If the calculation says you lose, you do not fight today; you change the terms until the calculation changes. Most failed startups, lawsuits, and career gambles are lost exactly here — at the refusal to run the numbers before the commitment.',
        ],
      },
      {
        title: 'The economics of conflict',
        paragraphs: [
          'Chapter two, "Waging War," is about cost. A long campaign, Sun Tzu says, has never benefited any country. Every day of conflict burns resources whether you are winning or losing, so speed is not a tactic — it is the strategy. When you must act, act to conclude.',
          'Applied outside war: the expensive part of most disputes is duration. The negotiation that drags, the lawsuit that runs years, the price war with no end condition — these defeat both sides. Before entering any conflict, Sun Tzu would ask: what is my exit, and how fast can I reach it?',
        ],
      },
      {
        title: 'Win first, then fight',
        paragraphs: [
          'The famous line of chapter four is that victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win. Position — where you stand before the contest begins — decides more than performance during it.',
          'This is why Sun Tzu spends so much of the book on things that happen before contact: intelligence, terrain, alliances, supply. In a career, position is your savings, your skills, your reputation, your alternatives. The person who can walk away from a negotiation has already won it; everything said at the table merely reveals that fact.',
        ],
      },
      {
        title: 'Deception, formlessness, and water',
        paragraphs: [
          'All warfare is based on deception — not lying for its own sake, but controlling what the other side believes about you. Appear weak where you are strong, strong where you are weak, far when near. The purpose is to make the opponent spend resources defending the wrong thing.',
          'The deeper idea is formlessness. Water, Sun Tzu’s favorite image, has no shape of its own; it takes the shape of the ground and always finds the gap. A strategist with no fixed shape cannot be planned against. In practice this means holding your options visibly open, and letting the other side commit first.',
        ],
      },
      {
        title: 'The general and the sovereign',
        paragraphs: [
          'A thread often skipped in business summaries: Sun Tzu’s chapters on command are about the relationship between the general in the field and the ruler at home. A general must sometimes disobey an order the ruler gave without seeing the ground. Authority without information is dangerous; information without authority is useless.',
          'Every organization still fights this battle — headquarters versus the front line. Sun Tzu’s resolution is trust built before the campaign: the ruler picks the general carefully, then stops interfering. If you manage people, the lesson is to choose well and delegate whole problems, not tasks.',
        ],
      },
      {
        title: 'Reading it today',
        paragraphs: [
          'Read The Art of War slowly, one chapter a day, and after each chapter write a single sentence about a live situation in your own life it describes. The book is short — thirteen chapters, an hour of reading — but it is compressed to the density of proverbs, and it only opens up against real problems.',
          'And hold on to its moral center, which the airport summaries drop: Sun Tzu hated war. The book exists because conflict is ruinously expensive and should be ended as quickly and bloodlessly as possible. Strategy, in the end, is the art of wasting less of your one life on fighting.',
        ],
      },
    ],
  },
  {
    slug: 'meditations-companion',
    title: 'Meditations: The Private Notebook of an Emperor',
    subtitle: 'A guided reading of Marcus Aurelius for people with too much to do',
    basedOn: 'Meditations',
    author: 'Marcus Aurelius',
    era: 'AD 161–180',
    categorySlug: 'expert-mastery',
    minutes: 13,
    description:
      'The most powerful man in the world kept a journal to keep himself sane, and never meant anyone to read it. This companion explains where the Meditations came from, how Stoicism actually works, and how to read the book so it changes your week, not just your quotes.',
    chapters: [
      {
        title: 'A book that was never a book',
        paragraphs: [
          'Marcus Aurelius ruled Rome through plague, flood, betrayal, and nineteen years of border war — and at night, in a military camp on the Danube, he wrote notes to himself in Greek. He called them simply "to himself." He repeats himself, contradicts himself, scolds himself. That is why the book feels alive: you are not reading philosophy, you are watching a man practice it.',
          'Knowing this changes how you should read it. Do not read the Meditations cover to cover like a novel. Open it anywhere. Each entry was one morning’s attempt by a tired man to get his mind right before a day he did not choose. Use it the same way.',
        ],
      },
      {
        title: 'The dichotomy of control',
        paragraphs: [
          'The engine of Stoicism is a single distinction: some things are up to you — your judgments, intentions, and responses — and everything else is not: your reputation, your health, other people’s behavior, the outcome. Suffering, the Stoics claim, comes from staking your peace on the second category.',
          'Marcus drills this constantly. When someone wrongs him, he rehearses: this person acts from their own understanding; my task is only my own response. It sounds passive until you try it in a real conflict and discover it is the opposite — all the energy you were spending on outrage becomes available for action.',
        ],
      },
      {
        title: 'The morning preparation',
        paragraphs: [
          'The most famous entry begins: "When you wake in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly." This is not cynicism. It is rehearsal. Marcus prepares for difficult people the way an athlete warms up, so that rudeness at 10 a.m. finds him already stretched.',
          'The practice transfers directly: before a hard meeting, name what will probably go wrong and decide your response while you are calm. The Stoics called this premeditatio malorum — the pre-study of troubles. Modern psychology reinvented it and found it works; rehearsed adversity loses most of its sting.',
        ],
      },
      {
        title: 'On mortality, without gloom',
        paragraphs: [
          'Marcus returns to death on nearly every page — emperors before him forgotten, whole generations vanished, the shortness of his own remaining time. Readers mistake this for morbidity. It is the reverse: a deliberate instrument for making the present valuable. You could leave life right now, he writes; let that determine what you do and say and think.',
          'The practical yield is priority. Almost everything we are anxious about, Marcus notes, is opinion about the future or resentment about the past — neither of which we occupy. The only place a life actually happens is now, and the discipline of remembering death is really the discipline of showing up to it.',
        ],
      },
      {
        title: 'The common good',
        paragraphs: [
          'The half of Stoicism that self-help versions cut out: Marcus believes humans exist for one another. "What injures the hive injures the bee." His notebook is full of reminders to be patient with fools, to correct gently or bear with them, to work for the common good as naturally as a fig tree bears figs — without expecting applause for it.',
          'This is what separates Stoicism from mere toughness. The point of mastering yourself is not to win; it is to be usable — by your family, your team, your city. An unshakable person who serves no one has, by Marcus’s standard, missed the entire point.',
        ],
      },
      {
        title: 'How to make it a practice',
        paragraphs: [
          'Three habits turn the Meditations from quotes into equipment. First, the morning line: one sentence to yourself about the day’s likely friction and your intended response. Second, the evening review, which Marcus learned from his own teachers: what did I do badly, what did I do well, what did I leave undone? Third, the reframe in the moment: is this in my control, or not?',
          'Do this for thirty days alongside a few pages of Marcus a night and you will understand why a private journal from a dead empire is still, two thousand years on, the most practical book on the shelf.',
        ],
      },
    ],
  },
  {
    slug: 'as-a-man-thinketh-companion',
    title: 'As a Man Thinketh: The Little Book of Cause and Effect',
    subtitle: 'James Allen’s 1903 essay on thought, character, and circumstance — explained and stress-tested',
    basedOn: 'As a Man Thinketh',
    author: 'James Allen',
    era: '1903',
    categorySlug: 'belajar-dasar',
    minutes: 11,
    description:
      'Sixty pages long and never out of print since 1903. Allen’s claim is radical: your character is the exact sum of your thoughts, and your circumstances grow from your character. This companion takes the claim seriously — including where it breaks.',
    chapters: [
      {
        title: 'The seed and the soil',
        paragraphs: [
          'Allen’s master metaphor is a garden. A mind, like a plot of soil, grows something no matter what — either the seeds you deliberately plant or the weeds that blow in. Thought is seed, character is the plant, circumstance is the harvest. The gardener who blames the harvest while ignoring the seed, Allen says, is every one of us on a bad day.',
          'The book’s enduring power is this refusal of victimhood without cruelty. Allen does not say suffering is deserved. He says the one lever always in your hand is the thought you consent to think next — and over years, that lever moves mountains that circumstance cannot.',
        ],
      },
      {
        title: 'Character as accumulated thought',
        paragraphs: [
          'A person does not "have" a temper, in Allen’s account; a person has practiced ten thousand angry thoughts until anger became reflex. Courage, patience, and honesty are built the identical way — repetition of chosen thoughts until they harden into what we call character. Neuroscience would later give this a name, but the 1903 description of habit formation is essentially correct.',
          'The uncomfortable corollary: you cannot think weak, resentful, dishonest thoughts privately and act strong, generous, and honest publicly for long. The inner practice leaks. Allen’s test of any secret thought is simple — it is a seed; what does it grow into at scale?',
        ],
      },
      {
        title: 'Where circumstance obeys — and where it does not',
        paragraphs: [
          'Allen overreaches, and an honest companion says so. Circumstances are not fully the fruit of thought: children do not think their way into poverty, and illness is not a character verdict. Read literally, the book can curdle into blaming the unlucky. The defensible version is narrower and still life-changing: thought determines response, response determines trajectory, and trajectory — compounded over years — is most of what we call luck.',
          'Allen himself gestures at this: circumstance, he writes, does not make the man; it reveals him to himself. Hardship is a mirror, not a sentence. Two people meet the same setback; the difference in what they think about it becomes, in ten years, the difference in their lives.',
        ],
      },
      {
        title: 'Purpose, or drift',
        paragraphs: [
          'The strongest chapter links thought to purpose. Aimlessness, Allen says, is a vice — a mind without a legitimate central purpose falls prey to petty worries and self-pity, which are as fatal to progress as deliberate wrongdoing. The cure is not grand ambition but a task made central: a craft, a duty, a course of study, held to with discipline.',
          'Notice the mechanism: a central purpose organizes thought automatically. The person building something has fewer vacant hours for resentment. Purpose is not the reward for a well-ordered mind; it is the tool that orders it.',
        ],
      },
      {
        title: 'Serenity as a power',
        paragraphs: [
          'The book closes on calmness, which Allen calls the last lesson of culture and one of the most valuable currencies in human life. People instinctively trust and follow the calm person, he observes, the way sailors trust a steady captain — and calmness is not temperament but the visible surface of long self-government.',
          'It is a startlingly modern note. In an economy of attention and panic, the person who does not escalate — in the email thread, in the market drop, in the family crisis — becomes the fixed point everything else organizes around. Allen’s sixty small pages are, finally, a training manual for becoming that person.',
        ],
      },
    ],
  },
  {
    slug: 'science-of-getting-rich-companion',
    title: 'The Science of Getting Rich: What Wattles Got Right',
    subtitle: 'A clear-eyed companion to the strange, practical 1910 classic on wealth',
    basedOn: 'The Science of Getting Rich',
    author: 'Wallace D. Wattles',
    era: '1910',
    categorySlug: 'bisnis-keuangan',
    minutes: 12,
    description:
      'Beneath its dated metaphysics, Wattles’ 1910 book contains a hard, usable core: definiteness of purpose, creation over competition, and doing each day’s work in a certain way. This companion separates the mysticism from the mechanics.',
    chapters: [
      {
        title: 'A book of its strange moment',
        paragraphs: [
          'The Science of Getting Rich came out of the New Thought movement of 1910 America — a world of mind-cure, mesmerism, and boundless frontier optimism. Wattles writes like an engineer trapped in a séance: for every cloudy claim about "thinking substance," there is a blunt, testable instruction about how to work today.',
          'The right way to read him is to translate. Where Wattles says the universe responds to gratitude and clear images, read: people respond to clarity, confidence, and consistent delivery — and you respond to your own expectations. Translated, nearly every practical chapter survives.',
        ],
      },
      {
        title: 'Definiteness: the unreasonable clarity',
        paragraphs: [
          'Wattles’ first hard rule: you must know exactly what you want. Not "more money" but a specific picture — the trade, the sum, the shop, the house — held constantly. A vague want, he says, gets a vague life. This anticipates every modern finding about goals: specific and vivid beats general and worthy, every time.',
          'The daily mechanism is rehearsal. The clearer the picture, the more your small hourly choices bend toward it without drama. The person who knows precisely what they are building recognizes the useful customer, course, and conversation on sight — what looks like luck is mostly resolution.',
        ],
      },
      {
        title: 'Creation, not competition',
        paragraphs: [
          'The book’s moral spine: get rich by creating value, never by outmaneuvering someone for a fixed prize. The competitive mind, Wattles argues, is grasping at what exists; the creative mind makes something exist. One is a knife fight over a pie; the other is baking.',
          'This sounds pious until you see it as market advice. Commodity competition — same product, lower price — is a treadmill that exhausts everyone on it. The creative path — a better product, a new audience, an unserved need — is where nearly all durable fortunes actually come from. Wattles put the choice plainly a century before "blue ocean" had a name.',
        ],
      },
      {
        title: 'The certain way of doing each day’s work',
        paragraphs: [
          'The chapter modern readers skip is the best one. Wealth, Wattles insists, is not built by extraordinary acts but by doing every ordinary act in a certain way: efficiently, completely, and with more value given than price taken. Every transaction should leave the other person with a "use value" greater than the cash they paid.',
          'That over-delivery rule is the entire secret of reputation, and reputation is the entire secret of the long game. The tradesman whose every small job is slightly better than paid for is running an advertising campaign no budget can buy. Do each day all that can be done that day, Wattles says — but do each thing in the certain way.',
        ],
      },
      {
        title: 'Gratitude as an operating posture',
        paragraphs: [
          'Wattles devotes a whole chapter to gratitude, and dresses it in metaphysics — but strip the costume and a psychological engine remains. The grateful mind attends to what is working, and attention is the scarce resource; a builder who dwells on lack builds resentfully, slowly, and quits. Gratitude, in his system, is not politeness. It is fuel management.',
          'A century later, this is among the most replicated findings in positive psychology. The 1910 mystic’s advice — end each day by counting, specifically, what went right — is now standard cognitive practice. He was right for reasons he could not have known.',
        ],
      },
      {
        title: 'What to keep, what to leave',
        paragraphs: [
          'Leave: the thinking substance, the guarantee that the universe underwrites your desires, and any suggestion that poverty is a thinking error — it is often a policy error, a health event, or plain bad luck. Keep: definite purpose, the creative stance, over-delivery, gratitude, and the day fully done.',
          'Kept and practiced, those five are not mystical at all. They are the visible habits of nearly every self-made person you will ever meet — which is presumably why a strange little book from 1910 still finds a new generation of readers every decade.',
        ],
      },
    ],
  },
  {
    slug: 'twenty-four-hours-companion',
    title: 'How to Live on 24 Hours a Day: The First Time-Management Book',
    subtitle: 'Arnold Bennett’s 1908 program for the salaried and exhausted, annotated for now',
    basedOn: 'How to Live on 24 Hours a Day',
    author: 'Arnold Bennett',
    era: '1908',
    categorySlug: 'kursus-skill',
    minutes: 11,
    description:
      'Written for London office clerks in 1908, Bennett’s little book is the ancestor of every productivity system — and funnier and wiser than most of its descendants. This companion walks its program and adapts it to a phone-lit century.',
    chapters: [
      {
        title: 'The daily miracle',
        paragraphs: [
          'Bennett opens with the observation the whole genre still rests on: every morning you are handed twenty-four unearned hours, the same purse given to the busiest and the idlest person alive. You cannot save them, borrow against them, or receive more for good behavior. Income is unequal; time is the one perfectly equal wage.',
          'His target reader is not the failure but the vaguely dissatisfied success — the person who works, commutes, dines, dozes, and feels a quiet leak somewhere in the week. Bennett’s diagnosis: the working day is treated as "the day," and the sixteen hours around it as its margins. Reverse that, he says, and life changes without changing jobs.',
        ],
      },
      {
        title: 'The inner day',
        paragraphs: [
          'The program is concrete. Take ninety minutes on three evenings a week — one hour and a half, guarded like a business appointment — and give them to the deliberate cultivation of your mind: a course of serious reading, the study of an art, the mastery of a subject. Not entertainment; cultivation. This "inner day," Bennett promises, will soon matter more to you than the outer one.',
          'Note the modesty. Not five a.m., not every day, not heroics — four and a half hours a week, consistently, forever. Bennett is explicit that failure comes from starting too big. The beginner’s error, he writes, is to attempt too much and be defeated by the first cold morning of enthusiasm.',
        ],
      },
      {
        title: 'The commute, the mind, and the phone',
        paragraphs: [
          'His most famous prescription: use the morning commute to train concentration. Fix a thought and hold it against drift, daily, like a gym for attention. In 1908 the enemy was woolgathering; ours is a device engineered by thousands of clever people to defeat exactly this exercise. The practice is unchanged — only harder, and therefore worth more.',
          'The modern translation: any pocket of waiting — the queue, the kettle, the train — is either attention training or attention decay; there is no neutral. Bennett would not tell you to delete anything. He would tell you to notice who is spending whom.',
        ],
      },
      {
        title: 'Reflection: the neglected organ',
        paragraphs: [
          'One evening of the weekly program, Bennett assigns not to reading but to reflection — an examination of your own conduct against your own principles. Happiness, he insists, comes not from pleasure but from this alignment, and no amount of reading substitutes for the uncomfortable half hour of honest audit.',
          'This is the chapter that lifts the book above technique. A schedule full of self-improvement can still be a well-organized evasion. The weekly audit — what do I claim to value, and what did I actually do — is the mechanism that keeps the whole program honest.',
        ],
      },
      {
        title: 'Warnings from 1908 that still hold',
        paragraphs: [
          'Bennett closes with failure modes, all recognizable. The prig: do not become insufferable about your new regimen. The slave of the program: leave slack, because a timetable that cannot survive a friend’s visit is a tyranny, not a tool. And the rusher: do not try to reform the whole week at once; guard the first ninety minutes until they are unshakable, then add.',
          'A century of productivity literature has mostly rediscovered these pages with worse prose. Start absurdly small; protect the appointment with yourself; train attention daily; audit weekly; keep your humor. The clerk’s program of 1908 remains, quietly, the state of the art.',
        ],
      },
    ],
  },
  {
    slug: 'self-reliance-companion',
    title: 'Self-Reliance: Emerson Without the Embroidery',
    subtitle: 'The 1841 essay that built American individualism — what it says, and what it costs',
    basedOn: 'Self-Reliance',
    author: 'Ralph Waldo Emerson',
    era: '1841',
    categorySlug: 'belajar-dasar',
    minutes: 12,
    description:
      'Trust thyself, imitation is suicide, a foolish consistency is the hobgoblin of little minds — the quotes escaped the essay long ago. This companion puts them back in context and asks what self-reliance means in an age that farms out its opinions.',
    chapters: [
      {
        title: 'The scandal of the ordinary self',
        paragraphs: [
          'Emerson’s opening move is still startling: in every work of genius, he says, we recognize our own rejected thoughts, returning with a certain alienated majesty. You already had the insight; you dismissed it because it was yours. Genius is not a different kind of mind but a different degree of self-trust.',
          'The essay’s whole program follows from that diagnosis. The reason we quote sages instead of speaking, imitate careers instead of building, and poll the room before knowing our own view, is not modesty — it is a habit of self-dismissal, learned early and rewarded often. Emerson calls conformity the virtue most in request in society, and means it as an indictment.',
        ],
      },
      {
        title: 'Nonconformity has a price tag',
        paragraphs: [
          'Emerson is honest about the bill. Speak your latent conviction and the world will whip you with its displeasure, he warns; for nonconformity society charges its full fee. What is harder, he adds, is not the world’s scorn but your own past — yesterday’s stated opinions glaring at you when today’s thought contradicts them.',
          'Hence the most misquoted sentence in American letters: a foolish consistency is the hobgoblin of little minds. Not consistency — foolish consistency: loyalty to your previous public statements at the expense of your present understanding. Speak what you think today in hard words, he says, and tomorrow speak tomorrow’s thought, though it contradict everything you said.',
        ],
      },
      {
        title: 'What self-reliance is not',
        paragraphs: [
          'Two centuries of misuse have made the essay a mascot for stubbornness, isolation, and never apologizing. Emerson meant none of it. His self-trust is grounded in the conviction that the same moral nature runs through every person — you trust yourself because at bottom the self opens onto something universal, which is also why the genuinely self-reliant person can respect the same independence in others.',
          'Nor is it a rejection of learning. Emerson read everything; the essay is dense with Plutarch and scripture. The instruction is not to avoid other minds but to digest rather than swallow — books are for the scholar’s idle times, he wrote elsewhere; when you can read your own thought, read that.',
        ],
      },
      {
        title: 'Self-reliance in an outsourced age',
        paragraphs: [
          'Emerson worried about newspapers and inherited creeds. We have recommendation engines, follower counts, and a feed that tells us each morning what to be angry about. The mechanics changed; the transaction is identical — the surrender of private judgment for the comfort of the crowd, now with instant settlement.',
          'The modern practice of the essay is therefore concrete: form your view before reading the replies. Write your estimate before checking the consensus. Sit with a question for ten minutes before searching it. These small delays are where a self gets built; skip them for years and there is no one home to rely on.',
        ],
      },
      {
        title: 'The usable core',
        paragraphs: [
          'Keep four instructions. Record your own flashes of thought — that is the whole discipline of genius. Expect and budget for disapproval; it is the tax, not a verdict. Revise loudly when you learn; foolish consistency is the cheap substitute for integrity. And do your own work: envy is ignorance, imitation is suicide, and your acre of ground, however small, is the only one that will yield to your plow.',
          'Emerson’s promise is not success but solidity — the peace, as the essay ends, that comes from the triumph of principles. In a rented culture, the person who owns their judgments is rich in the only currency that never devalues.',
        ],
      },
    ],
  },
  {
    slug: 'franklin-autobiography-companion',
    title: 'Franklin’s Autobiography: The Original Self-Improvement Experiment',
    subtitle: 'The printer’s apprentice who invented the American success manual — read critically',
    basedOn: 'The Autobiography of Benjamin Franklin',
    author: 'Benjamin Franklin',
    era: '1771–1790',
    categorySlug: 'expert-mastery',
    minutes: 13,
    description:
      'Runaway apprentice, printer, inventor, diplomat, founder. Franklin’s unfinished memoir is the template of every self-made story since — including its tricks. This companion mines the method and flags the marketing.',
    chapters: [
      {
        title: 'A life told as a how-to',
        paragraphs: [
          'Franklin frames his memoir, addressed to his son, as a set of usable instructions: having emerged from poverty and obscurity to affluence and some reputation, he writes, his posterity may like to know the means, as fit to be imitated. No one had written a life quite that way before — not confession, not chronicle, but method.',
          'Remember while reading that Franklin was the best publicist of his age, and his own best client. He tells us candidly that he not only was industrious, but took care to appear industrious — hauling his own paper through the streets in a wheelbarrow so Philadelphia could watch. The book teaches image management by practicing it on the reader.',
        ],
      },
      {
        title: 'The thirteen virtues experiment',
        paragraphs: [
          'The famous core: thirteen virtues — temperance, silence, order, resolution, frugality, industry, sincerity, justice, moderation, cleanliness, tranquility, chastity, humility — tracked in a little book, one virtue per week, a dot for every fault. Franklin ran the cycle four times a year, like a man debugging himself.',
          'Two design choices make it modern. He worked on one virtue at a time, knowing willpower is a bottleneck, and he measured instead of vowing — the dots turned character into data. He also reports the results honestly: order he never mastered, humility he only learned to imitate, and the imitation, he notes drily, worked nearly as well.',
        ],
      },
      {
        title: 'The junto: compounding by committee',
        paragraphs: [
          'At twenty-one, Franklin gathered a dozen tradesmen into a Friday club, the Junto, for structured mutual improvement: each member brought queries on morals, politics, or business, and essays for critique. From this one room came a library, a fire company, a university, a hospital — and most of Franklin’s opportunities for decades.',
          'It is the least-copied and most valuable practice in the book. The modern reader has networks; Franklin built an engine — small, closed, regular, with obligations. A handful of serious peers meeting on a fixed schedule to improve one another remains the highest-yield instrument in self-education, and it still costs nothing.',
        ],
      },
      {
        title: 'Errata: the accounting of mistakes',
        paragraphs: [
          'Franklin lists his moral failures in printer’s language as errata — errors of the press: breaking his brother’s apprenticeship, spending a friend’s money entrusted to him, neglecting his fiancée. He neither wallows nor hides; he records, corrects where possible, and moves the ledger forward.',
          'The stance is worth stealing. A mistake treated as identity paralyzes; treated as an erratum, it becomes an entry to be corrected in the next edition. Franklin’s cheerful bookkeeping of his own faults is the psychological hinge of the whole self-improvement tradition he founded.',
        ],
      },
      {
        title: 'What the template leaves out',
        paragraphs: [
          'Read critically, the Autobiography is also a lesson in what success stories omit. Franklin had luck he undersells, help he compresses, and a wife whose labor underwrote the shop while he founded institutions. The genre he invented — obscurity, industry, system, triumph — still ships with the same blind spots.',
          'Take the method, then, and leave the myth of the wholly self-made man. The method is real: one virtue at a time, measured; visible industry; a small engine of peers; mistakes as errata; and relentless, curious, cheerful work. It built a printer into a founder, and it is all still available for the price of a notebook.',
        ],
      },
    ],
  },
  {
    slug: 'acres-of-diamonds-companion',
    title: 'Acres of Diamonds: The Fortune Under Your Feet',
    subtitle: 'Russell Conwell’s barnstorming lecture on opportunity close to home — and its limits',
    basedOn: 'Acres of Diamonds',
    author: 'Russell H. Conwell',
    era: '1890–1915',
    categorySlug: 'bisnis-keuangan',
    minutes: 10,
    description:
      'Conwell delivered this lecture over six thousand times and used the fees to found a university. Its parable — the man who sold his farm to hunt diamonds that lay in his own backyard — built a whole philosophy of local opportunity.',
    chapters: [
      {
        title: 'The parable and its engine',
        paragraphs: [
          'The frame story: Ali Hafed, a prosperous Persian farmer, hears of diamonds, sells his land, and dies destitute searching the world for them — while the man who bought his farm finds, in its garden brook, the diamond mine of Golconda. Acres of diamonds, Conwell hammers, lie under your own feet, if you will dig for them.',
          'The engine of the lecture is redirection. The audience arrives believing opportunity is elsewhere — the city, the frontier, someone else’s industry. Conwell spends two hours listing fortunes made from observing one’s own neighbors: the man who studied what his town lacked and supplied it. Opportunity, in his telling, is not a place but a way of looking.',
        ],
      },
      {
        title: 'Serve first, then prosper',
        paragraphs: [
          'Under the showmanship is a respectable economic idea: wealth flows to whoever best serves the actual, observable needs of the people around them. Conwell’s repeated instruction is to find out what people need, then supply it better than anyone — greatness, he says, consists not in holding an office but in doing common things uncommonly well.',
          'He is also bracingly unsentimental about money for a clergyman: to make money honestly is to preach the gospel, he declares, because honest wealth is a record of service rendered. One may argue with the theology; the customer-first mechanics are simply how durable businesses have always been built.',
        ],
      },
      {
        title: 'What the lecture gets wrong',
        paragraphs: [
          'Honesty requires the other column. Conwell at his worst slides from "opportunity is nearby" to "poverty is a character flaw" — a cruelty the century since has thoroughly refuted. Structures, luck, health, and history move outcomes in ways no backyard digging overcomes, and a companion that skipped this would be marketing, not reading.',
          'Keep the discipline, discard the judgment. The claim worth keeping is modest and true: before concluding that your chance lies somewhere far and expensive, exhaust the ground you already stand on — the skills, neighbors, and unmet needs within reach. Most people quit their acre before surveying it.',
        ],
      },
      {
        title: 'Digging your own acre, practically',
        paragraphs: [
          'Translated to the present, Conwell’s survey looks like this: list what the people around you complain about; list what you are asked for help with repeatedly; list what your town, trade, or online community lacks that adjacent ones have. Somewhere on those three lists is work that pays because it is needed, not because it is glamorous.',
          'The deeper legacy is what Conwell did with the lecture itself: sixty years of fees became Temple University, night classes for working people — his own acre, dug thoroughly. The parable’s best proof was its teller.',
        ],
      },
    ],
  },
  {
    slug: 'poor-richard-companion',
    title: 'Poor Richard’s Almanack: Proverbs for the Long Game',
    subtitle: 'Franklin’s money wisdom, one maxim at a time — with the arithmetic shown',
    basedOn: 'Poor Richard’s Almanack / The Way to Wealth',
    author: 'Benjamin Franklin',
    era: '1732–1758',
    categorySlug: 'bisnis-keuangan',
    minutes: 10,
    description:
      'For twenty-five years Franklin seeded an almanac with maxims on industry, thrift, and debt, then distilled them into The Way to Wealth — possibly the most reprinted money essay ever. This companion unpacks the best of them for modern balances.',
    chapters: [
      {
        title: 'An almanac with an agenda',
        paragraphs: [
          'Poor Richard was a character — a henpecked stargazer whose margins Franklin salted with one-liners because, he admitted, the spaces between remarkable days had to be filled with something. The proverbs were borrowed freely from the ages and sharpened for print: brevity was the business model.',
          'In 1758 Franklin gathered the greatest hits into a single speech by "Father Abraham" at an auction — The Way to Wealth. The joke of the frame is easy to miss: the crowd listens to the sermon on thrift, nods along, and then buys extravagantly the moment the auction opens. Franklin knew exactly how advice works on people, including his readers.',
        ],
      },
      {
        title: 'Time is the stock you trade',
        paragraphs: [
          'Dost thou love life? Then do not squander time, for that is the stuff life is made of. The almanac’s money advice starts as time advice: lost time is never found again; early to bed and early to rise was less about virtue than about beating competitors to the day’s trade.',
          'The compounding logic is explicit in the famous line "time is money" — from Franklin’s Advice to a Young Tradesman: the shilling not earned today is not merely a shilling lost, but all its future offspring too. Franklin was teaching opportunity cost to shopkeepers a century before economists named it.',
        ],
      },
      {
        title: 'The tyranny of small leaks',
        paragraphs: [
          'Beware of little expenses; a small leak will sink a great ship. The almanac’s thrift is not miserliness but attention: the daily trifle, priced honestly across a year, is a servant’s wage. Franklin’s readers counted candles and tea; ours count subscriptions and fees — the ship and the leak have not changed, only the water.',
          'Twinned with it: the folly of paying for appearances. Silks and satins put out the kitchen fire, says Poor Richard; buying finery to signal wealth is the surest way never to have any. The modern literature on status spending has added charts to a conclusion the almanac reached in a couplet.',
        ],
      },
      {
        title: 'Debt: the borrowed spine',
        paragraphs: [
          'The Way to Wealth saves its heaviest fire for debt. He that goes a-borrowing goes a-sorrowing; the borrower is a slave to the lender; when you run in debt, you give to another power over your liberty. For Franklin the issue is not arithmetic but sovereignty — the indebted tradesman must please his creditor, and a man who must please cannot speak plainly.',
          'The exception he lived, though rarely preached, is productive debt: the press he borrowed to buy made him free. The working rule that falls out of the almanac is still sound — borrow only for what earns, never for what merely appears.',
        ],
      },
      {
        title: 'Industry plus frugality, and the missing third',
        paragraphs: [
          'The system in one line: industry pays the debts, while despair increases them — earn diligently, spend attentively, and let the difference compound. It is two-thirds of a complete personal finance course written before the United States existed.',
          'The missing third is investing, and Franklin supplied it in his own way: his famous bequest left small funds to Boston and Philadelphia to compound for two hundred years, growing from a few thousand pounds into millions. The almanac’s shortest possible summary might be his truest sentence: money makes money, and the money that money makes, makes money.',
        ],
      },
    ],
  },
  {
    slug: 'tao-te-ching-companion',
    title: 'The Tao Te Ching for Builders and Leaders',
    subtitle: 'Eighty-one short chapters on power that doesn’t grip — read from the working world',
    basedOn: 'Tao Te Ching',
    author: 'Laozi (attributed)',
    era: 'c. 4th century BC',
    categorySlug: 'expert-mastery',
    minutes: 12,
    description:
      'The Tao Te Ching is the anti-management book that managers keep rediscovering: lead without forcing, act without straining, win without contending. This companion reads its central ideas against modern work rather than incense smoke.',
    chapters: [
      {
        title: 'A manual written in water',
        paragraphs: [
          'Eighty-one chapters, none longer than a page, most of them paradoxes: the soft overcomes the hard, the empty is useful, the way that can be named is not the way. The Tao Te Ching resists summary on purpose — it is trying to point at the grain of reality that plans and titles paper over.',
          'Its recurring teacher is water: nothing in the world is softer, yet nothing is better at wearing down stone. Water wins by conforming, persisting, and seeking the low places everyone else avoids. Every practical lesson in the book is some variation on learning to work the way water works.',
        ],
      },
      {
        title: 'Wu wei is not doing nothing',
        paragraphs: [
          'The most misread idea, wu wei, translates poorly as "non-action." It means action without forcing — the effort that goes with the grain instead of against it. The cook in the famous Taoist story never hacks; his blade finds the joints, and stays sharp for nineteen years. Strain, in this view, is a signal you are cutting bone instead of joint.',
          'In working terms: the campaign that requires constant pushing is misdesigned; the process people must be forced through is fighting its users; the habit that takes heroic willpower is scheduled against your own nature. Wu wei asks the engineering question — where is the joint? — before asking for more force.',
        ],
      },
      {
        title: 'The leader who is barely noticed',
        paragraphs: [
          'Chapter seventeen ranks leaders. The worst is despised; the next is feared; the next is loved and praised. The best, when the work is done, leaves the people saying: we did it ourselves. The Tao Te Ching is the earliest and still the purest statement of leadership as subtraction — remove obstacles, set conditions, and disappear from the credits.',
          'The book’s advice to the powerful is relentless self-effacement, and it is strategic, not modest: the sage puts himself last and finds himself first, because a leader who hoards credit trains everyone to stop generating any. Rivers rule the valleys, says chapter sixty-six, by lying lower than them.',
        ],
      },
      {
        title: 'Knowing when enough is enough',
        paragraphs: [
          'Fill a cup to the brim and it spills; sharpen a blade too far and it dulls; chase wealth and status past sufficiency and they own you. Chapter nine’s counsel — do your work, then step back — is the book’s answer to burnout twenty-four centuries early. He who knows he has enough is rich, adds chapter thirty-three.',
          'This is not anti-ambition; it is anti-overshoot. Systems pushed past their design point break in expensive ways — portfolios, schedules, reputations, bodies. The Taoist habit is to identify the sufficiency line in advance, and to treat crossing it not as winning harder but as beginning to lose.',
        ],
      },
      {
        title: 'Difficult things while they are easy',
        paragraphs: [
          'The most operational chapter, sixty-three: handle the difficult while it is still easy; handle the great while it is still small. A tree that fills your arms grew from a shoot; a nine-story tower rises from a basket of earth; a journey of a thousand miles begins beneath your feet. Problems, like trees, are cheapest at the seedling stage.',
          'Paired with it, chapter sixty-four’s warning: people ruin things at the point of completion — care at the end as at the beginning. Between them, the two chapters contain most of risk management and most of quality control, in ninety words, without a single diagram.',
        ],
      },
    ],
  },
  {
    slug: 'focus-course',
    title: 'Focus: A Practical Course in Attention',
    subtitle: 'An original short course on doing one thing at a time in a world built to prevent it',
    basedOn: 'Original AXTO.dev course',
    author: 'AXTO.dev Editorial',
    era: 'This year',
    categorySlug: 'kursus-skill',
    minutes: 12,
    description:
      'Attention is the input every other skill depends on, and the one modern life taxes hardest. This original course covers the mechanics of focus, the design of an undistracted hour, and the weekly structure that makes deep work a habit instead of an event.',
    chapters: [
      {
        title: 'Lesson one: attention is a budget, not a virtue',
        paragraphs: [
          'Start with the accounting truth: you get roughly three to four hours of genuinely high-quality concentration a day — the research on skilled performers keeps landing on the same number. Everything about focusing well follows from treating those hours as a budget to be allocated, not a character trait to feel guilty about.',
          'The corollary is triage. If the deep hours are few, they must go to the work only you can do — the craft, the study, the building — and never to the inbox, which happily consumes any quality of attention you feed it. The first exercise of this course is simply naming, each morning, what will get today’s best two hours.',
        ],
      },
      {
        title: 'Lesson two: the switch tax',
        paragraphs: [
          'Every glance away from a demanding task leaves what researchers call attention residue — part of your mind stays with the message you just peeked at, for minutes afterward. Ten peeks an hour means you never actually work at full depth at all; you work in a permanent shallow of your own making.',
          'The fix is structural, not moral: batch the switches. Check messages at set times, fully, then close them fully. The person who checks email three times a day at scheduled points answers everything and loses almost nothing; the person who checks thirty times loses a third of their thinking capacity to residue and remembers it as a busy day.',
        ],
      },
      {
        title: 'Lesson three: designing the undistracted hour',
        paragraphs: [
          'An hour of real focus is manufactured, and the factory has four walls. One: a single, concrete target — not "work on the report" but "draft section two." Two: a closed environment — the phone in another room outperforms the phone face-down, every time it has been tested. Three: a visible timer, because a boundary calms the mind that would otherwise check the clock. Four: a capture pad, where stray thoughts get written instead of followed.',
          'Then expect the wall at minute eight. Concentration has a warm-up cost; the itch to escape peaks early and passes if unfed. Surviving that first wall without switching is the entire skill — each time you sit through it, the next hour starts easier.',
        ],
      },
      {
        title: 'Lesson four: boredom training',
        paragraphs: [
          'Focus during work is decided by habits outside work. A mind that reaches for the phone at every red light, queue, and elevator ride is rehearsing distraction thousands of times a week — and then asked to concentrate on demand at a desk. The training runs the wrong way all day and is expected to reverse at nine a.m.',
          'The countermeasure is deliberately boring gaps: waits taken without a screen, walks without input, a few minutes daily of doing exactly nothing. This is not wellness decoration; it is interval training for the attention system. Two weeks of tolerated boredom measurably lengthens the focus you can hold at the desk.',
        ],
      },
      {
        title: 'Lesson five: the weekly architecture',
        paragraphs: [
          'Habits beat heroics, so the course ends with a calendar, not a pep talk. Choose three deep blocks a week of ninety minutes each — mornings if you can, guarded like client meetings, with a named deliverable per block. Three real blocks a week outproduce a fantasy of daily five-hour marathons that survive one Tuesday.',
          'Close each week with a five-minute audit: which blocks happened, what broke the ones that didn’t, and what one change protects next week. Attention, budgeted, defended, and reviewed, compounds like money — and after a season of this you will not want your old week back at any price.',
        ],
      },
    ],
  },
  {
    slug: 'learning-to-learn-handbook',
    title: 'Learning How to Learn: A Self-Study Handbook',
    subtitle: 'An original guide to studying anything alone — evidence-based, tool-agnostic, free',
    basedOn: 'Original AXTO.dev handbook',
    author: 'AXTO.dev Editorial',
    era: 'This year',
    categorySlug: 'kursus-skill',
    minutes: 12,
    description:
      'Most people study the way they were shown at twelve: reread, highlight, cram, forget. This handbook compiles what actually moves the needle for self-taught learners — retrieval, spacing, difficulty, and projects — into one usable program.',
    chapters: [
      {
        title: 'Throw away the highlighter',
        paragraphs: [
          'The uncomfortable finding replicated for a century: rereading and highlighting feel productive and produce almost nothing. They generate familiarity — the warm sense of "I know this" — which evaporates at the first real question. Familiarity is the counterfeit currency of studying, and most study time is spent printing it.',
          'What works is retrieval: closing the book and producing the material from memory — explaining it aloud, writing it from scratch, answering questions cold. Retrieval feels worse, because it exposes the gaps. That feeling of struggle is not a sign the method is failing; it is the method working. Learning happens at exactly the point where recall is effortful.',
        ],
      },
      {
        title: 'Spacing: the free multiplier',
        paragraphs: [
          'Ten hours crammed into one day produces a fraction of what the same ten hours produce spread over three weeks. The spacing effect is among the oldest and most robust results in psychology, and it is free — no tool, no talent, just scheduling. Forgetting a little between sessions is the ingredient, not the enemy: each effortful re-recall re-lays the memory stronger.',
          'A workable default for the self-learner: revisit new material the next day, then after three days, then a week, then a month. Whether you manage that with an app or a paper calendar is a matter of taste. What is not optional is the gap — study that never lets you begin to forget never forces you to remember.',
        ],
      },
      {
        title: 'Interleaving and desirable difficulty',
        paragraphs: [
          'Blocked practice — twenty problems of the same type in a row — feels smooth and teaches you to recognize the drill, not the skill. Interleaving — mixing problem types so each one demands you first identify what kind of problem it even is — feels clumsy and produces dramatically better transfer to real situations, where problems never announce their type.',
          'The general principle is desirable difficulty: conditions that make practice harder in the right way make learning stronger. Testing before you feel ready, mixing topics, generating answers before checking, practicing from memory in the wrong order — the frustration these cause is the sensation of durable learning being laid down. Comfortable study is usually decorative.',
        ],
      },
      {
        title: 'The Feynman move',
        paragraphs: [
          'The fastest gap-detector ever devised costs one sheet of paper: explain the topic in plain words, as if to a bright twelve-year-old, without looking. Where the explanation goes vague, where you reach for jargon, where the "because" runs out — that is the exact border of your understanding, mapped in five minutes.',
          'Then go back to the source for those points only, and explain again. Two or three cycles of this converts fog into structure faster than ten passive rereads. Writing for others — notes, posts, answers to strangers’ questions — is the same move with the added bonus that the internet will find your errors for free.',
        ],
      },
      {
        title: 'Projects: the forcing function',
        paragraphs: [
          'Courses end; skills begin when something real depends on them. The self-learner’s most reliable trick is to pick a small concrete project slightly beyond current ability — a working tool, a translated story, a published piece, a repaired machine — and let it pull the study. Projects force retrieval, spacing, and interleaving automatically, because reality does not present material in chapter order.',
          'Size the project to finish in weeks, not seasons; finished small things compound morale and portfolio alike. Then stack the next one. A year of six modest completed projects beats a year of three abandoned masterpieces and any number of certificates — in skill, in proof, and in the appetite to continue.',
        ],
      },
    ],
  },
  {
    slug: 'aesop-for-grown-ups',
    title: 'Aesop for Grown-Ups: Office Politics in Animal Costume',
    subtitle: 'The old fables re-read as a field guide to work, money, and human nature',
    basedOn: 'Aesop’s Fables',
    author: 'Aesop (attributed)',
    era: 'c. 6th century BC',
    categorySlug: 'belajar-dasar',
    minutes: 11,
    description:
      'The fables were never children’s stories — they were survival notes from the bottom of an unequal world, sharp enough that tradition says their author was killed for telling them. Re-read as an adult, they map the modern workplace with unsettling precision.',
    chapters: [
      {
        title: 'Stories sharp enough to get a man killed',
        paragraphs: [
          'Tradition makes Aesop an enslaved storyteller whose fables spoke truths to the powerful that plain speech could not survive — and who was eventually thrown from a cliff at Delphi for one truth too many. Whatever the historical facts, the tradition preserves the fables’ real function: political commentary wearing fur and feathers for deniability.',
          'That is why they still cut. The animals let us see maneuvers we are too close to when humans perform them — flattery, face-saving, coalition, betrayal. A fable is a lab experiment on human nature with the confounding variables shaved off.',
        ],
      },
      {
        title: 'The fox and the grapes: the economics of cope',
        paragraphs: [
          'The fox leaps for the grapes, misses, and trots off declaring them sour. Twenty-six centuries before psychology named cognitive dissonance, Aesop had drawn it: when we fail to get what we wanted, we revise the wanting rather than the self-assessment.',
          'The grown-up reading is about audit, not mockery. Everyone declares grapes sour weekly — the job not applied for, the market not entered, the skill not attempted. The useful question the fable installs is a reflex: is this thing actually not worth wanting, or did I just miss the jump? The two require opposite next moves, and cope reliably mislabels which is which.',
        ],
      },
      {
        title: 'The tortoise, the hare, and the compounding of boring',
        paragraphs: [
          'The hare’s failure is not speed but discontinuity — brilliance in bursts, punctuated by naps of self-congratulation. The tortoise wins with the dullest strategy in the fable canon: continuous, unimpressive forward motion. Every field has both animals, and every field’s long-term winners are disproportionately tortoises.',
          'The modern translation is consistency as an edge precisely because it is rare. Publishing weekly beats publishing brilliantly and rarely; saving monthly beats windfall investing; the mediocre routine kept beats the perfect routine abandoned. Slow is not the moral. Uninterrupted is the moral.',
        ],
      },
      {
        title: 'Flattery, borrowed feathers, and the boy who cried wolf',
        paragraphs: [
          'The crow holds the cheese until the fox praises her singing voice; the jackdaw dresses in peacock feathers and is stripped by both species; the shepherd boy spends the town’s trust on jokes and cannot buy it back when the wolf is real. Three fables, one subject: reputation as a currency — how it is stolen from you, counterfeited by you, and bankrupted by you.',
          'The workplace translations need no footnotes. Flattery is a pickpocket’s distraction; borrowed credentials get audited at the worst moment; and credibility spends like cash but rebuilds like glaciers. Aesop’s advice compresses to: sing less, wear your own feathers, and never spend trust on effect.',
        ],
      },
      {
        title: 'The north wind, the sun, and how change actually happens',
        paragraphs: [
          'The wind and the sun bet on who can strip the traveler’s cloak. The wind blasts; the man clutches the cloak tighter. The sun warms; the man removes it himself. It is the oldest and shortest treatise on influence: force produces resistance in exact proportion; conditions produce voluntary movement.',
          'Every manager, parent, marketer, and reformer eventually relearns this fable at their own expense. People defend against pressure and walk freely into warmth. If your strategy for changing anyone’s behavior amounts to blowing harder, Aesop had your performance review written before the invention of paper.',
        ],
      },
    ],
  },
];

export function getEbook(slug: string): Ebook | undefined {
  return LIBRARY.find((b) => b.slug === slug);
}

export function getEbooksByCategory(slug: string): Ebook[] {
  return LIBRARY.filter((b) => b.categorySlug === slug);
}
