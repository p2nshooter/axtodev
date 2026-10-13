import type { Article } from './types';

/**
 * AXTO.dev editorial library — batch 7 (13 Oct 2026). Five new hand-written
 * long-form guides on fundamentals that the library did not yet cover:
 * database transactions and isolation levels, password hashing, SQL
 * injection, backups that actually restore, and rate limiting. Original
 * writing, no product promotion, and nothing that overlaps the sibling site.
 */
export const ARTICLES_BATCH7: Article[] = [
  {
    slug: 'database-transactions-and-isolation-levels',
    category: 'languages',
    title: 'Database Transactions and Isolation Levels: Why Two Users Can Book the Same Last Seat',
    excerpt:
      'A transaction promises “all or nothing”, but it does not automatically promise that concurrent users cannot trip over each other. What isolation levels actually guarantee, the anomalies each one allows, and the patterns that prevent the classic double-booking bug.',
    date: '2026-10-13',
    minutes: 10,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Most developers learn early that wrapping database writes in a transaction makes them safe: either every statement succeeds or none of them do. That part is true. What surprises people — usually in production, usually under load — is that a transaction does not, by itself, stop two concurrent users from reading the same data, making decisions based on it and both writing results that are wrong when combined.',
        'The classic example is the last seat on a flight, the last ticket for a concert or the last item in stock. Two requests arrive at nearly the same moment, both see one seat left, both book it, and the system has sold the seat twice. Both requests used transactions. Understanding why that can happen, and what isolation levels do and do not promise, is one of the most practically useful pieces of database knowledge a developer can have.'] },
      { h: 'What a transaction actually guarantees', p: [
        'The usual summary is ACID: atomicity, consistency, isolation and durability. Atomicity means the statements in a transaction take effect together or not at all. Durability means that once a commit is acknowledged, the change survives a crash. Consistency, in this sense, means the database’s own constraints — unique keys, foreign keys, check constraints — hold before and after.',
        'Isolation is the property that matters for concurrency, and it is the one that comes in degrees. Full isolation would mean every transaction behaves as if it ran alone, one after another. Providing that is expensive, so databases offer weaker isolation levels by default and let you choose stronger ones when you need them.'] },
      { h: 'The four standard levels', p: [
        'The SQL standard defines four isolation levels, from weakest to strongest: read uncommitted, read committed, repeatable read and serializable. Each level rules out certain kinds of interference, called anomalies, and permits others. Real databases implement these levels in their own ways, so the exact behaviour of a level depends on the engine, but the vocabulary is shared.',
        'Defaults differ too. PostgreSQL uses read committed by default; MySQL’s InnoDB engine uses repeatable read by default. Many applications never change the default and never think about it, which is fine for most operations and quietly dangerous for a few specific ones.'] },
      { h: 'The anomalies, in plain terms', p: [
        'A dirty read happens when a transaction sees another transaction’s changes before they are committed — changes that might still be rolled back. Most engines effectively never allow this in practice, even at the weakest level. A non-repeatable read happens when a transaction reads the same row twice and gets different values because another transaction committed a change in between.',
        'A phantom happens when a transaction runs the same query twice and gets a different set of rows, because another transaction inserted or deleted matching rows. And there are anomalies the original standard did not name clearly but that bite real systems: the lost update, where two transactions read a value and both write a new value based on it, so one update silently overwrites the other; and write skew, where two transactions each check a condition, each make a change that is valid on its own, and together violate the condition.'] },
      { h: 'Walking through the double booking', p: [
        'Picture a seats table with a column for remaining seats. Request A starts a transaction, reads the row and sees one seat remaining. Request B starts a transaction, reads the same row and also sees one seat remaining, because A has not written anything yet. A decides the seat is available, decrements the count to zero and inserts a booking. B makes the same decision from the same stale information and also books.',
        'At read committed, nothing here breaks the rules: each transaction read committed data and wrote valid statements. The bug is in the pattern — read a value into the application, decide in application code, write back — which leaves a window in which the decision can become wrong. Whether stronger isolation catches it depends on the level and the engine, which is why it is better to design the pattern safely rather than rely on a default.'] },
      { h: 'Fix one: make the database do the check', p: [
        'The simplest fix is to move the decision into a single statement that the database executes atomically. Instead of reading the count and then writing, issue an update that only succeeds if a seat is available — an update that decrements the remaining count with a condition that the count is greater than zero — and check how many rows were affected. If the answer is zero, the seat was gone and the booking is refused.',
        'Because the condition and the change happen in one statement, two concurrent requests cannot both pass the check: the database serialises the two updates on that row, and the second sees the already-decremented value. Constraints help in the same way: a unique constraint on a seat number in a bookings table makes a second booking of the same seat fail outright, whatever the application logic believed.'] },
      { h: 'Fix two: lock what you are about to change', p: [
        'When the logic is too complex for one statement, you can take a row lock explicitly. In many SQL databases, reading with a locking clause such as SELECT … FOR UPDATE locks the selected rows until the transaction ends. A second transaction trying to lock the same rows waits until the first commits or rolls back, and then sees the updated values.',
        'Locks work, but they have costs. They make concurrent requests queue, so they should be held for as short a time as possible — never across a network call to another service or a user’s think time. And locking rows in inconsistent orders across different code paths can produce deadlocks, which the database resolves by aborting one of the transactions; your code must be ready to retry.'] },
      { h: 'Fix three: optimistic concurrency', p: [
        'Another approach avoids holding locks at all. Give the row a version number or a last-modified timestamp. Read it along with the data, and when writing, include the version in the condition: update the row only if the version is still the one you read, and increment it as you write. If another transaction changed the row in between, your update affects zero rows, and you know to reload and try again or report a conflict.',
        'Optimistic concurrency suits situations where conflicts are rare and holding locks would be wasteful — editing a document, updating a profile, changing settings. It turns a silent lost update into a visible, handleable conflict, which is almost always the right trade.'] },
      { h: 'Fix four: serializable isolation with retries', p: [
        'The strongest option is to run the sensitive transaction at the serializable level, which promises that the outcome is equivalent to running the transactions one at a time in some order. PostgreSQL, for example, implements this with a technique called serializable snapshot isolation, which tracks dependencies between concurrent transactions and aborts one of them when it detects that their combination could not have happened serially.',
        'The catch is that serializable transactions can fail with a serialization error even though nothing is wrong with your code, and the correct response is to retry the whole transaction. Applications that adopt serializable isolation need a retry loop around the transaction, with a limit, and transactions that are safe to repeat — which means no side effects such as sending emails inside them.'] },
      { h: 'Where the rules stop applying', p: [
        'Everything above concerns a single database. As soon as a decision spans two systems — a payment provider and your database, two microservices with their own stores, a cache and a database — database isolation cannot protect you, because no single transaction covers both. Those cases need different patterns: idempotency keys, outbox tables, compensating actions and careful handling of retries.',
        'Isolation guarantees also assume you use the database’s transactions properly. Reading data in one transaction, doing work in the application, and writing in a separate transaction gives up most of the protection, whatever level you choose. Keep the read, the decision and the write inside one transaction, or collapse them into one statement.'] },
      { h: 'A practical checklist', p: [
        'Find the places in your system where a read is followed by a decision and a write: stock levels, balances, quotas, seat counts, unique usernames. For each, ask what happens if two requests interleave. Prefer a single conditional statement or a database constraint; use row locks or optimistic versioning when the logic is more complex; reserve serializable isolation, with retries, for the cases where invariants span many rows.',
        'Then test it. A simple concurrency test that fires many simultaneous requests at the same resource and checks the invariant afterwards — no negative stock, no double booking — will find in minutes the race that would otherwise surface on your busiest day.'] },
      { h: 'Keep transactions short', p: [
        'Whatever isolation strategy you choose, long-running transactions cause trouble. They hold locks longer, increase the chance of conflicts and deadlocks, and in engines that keep old row versions for consistent reads, they can prevent cleanup of those versions and slowly bloat tables.',
        'Do the slow work — calling external APIs, rendering templates, waiting for user input — outside the transaction, then open the transaction, perform the read-decide-write sequence quickly and commit. A transaction should be measured in milliseconds wherever possible, not seconds.'] },
      { h: 'In short', p: [
        'Transactions make groups of writes atomic and durable, but isolation comes in levels, and common defaults allow anomalies such as lost updates and write skew. The double-booking bug is a read-decide-write pattern with a window between the read and the write.',
        'Close the window by letting the database check and change in one statement, by enforcing constraints, by locking rows briefly, by versioning rows optimistically, or by using serializable isolation with retries. Know your engine’s default, keep decisions inside a single transaction, and test the invariant under concurrent load.'] },
    ],
  },
  {
    slug: 'password-hashing-done-right',
    category: 'web',
    title: 'Storing Passwords Properly: Slow Hashes, Unique Salts and Why SHA-256 Is the Wrong Tool',
    excerpt:
      'Every application with a login form is one database leak away from exposing its users’ passwords. How password hashing differs from ordinary hashing, why speed is the enemy, what salts and peppers do, and the habits that keep a breach from becoming a disaster.',
    date: '2026-10-13',
    minutes: 10,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'If your application lets people log in with a password, you are holding something valuable that is not really yours. Many people reuse passwords across sites, so a password leaked from your database may open their email, their bank or their work accounts. Databases do leak — through bugs, misconfigured backups, stolen credentials or insiders — so the question is not only how to prevent a breach, but what an attacker gets if one happens.',
        'Stored correctly, passwords should be extremely expensive for an attacker to recover even with a full copy of your database. Stored badly, they can be recovered in bulk within hours. The difference comes down to a few decisions that are easy to get right and surprisingly common to get wrong.'] },
      { h: 'Never store passwords, and never encrypt them', p: [
        'Storing passwords in plain text is the obvious mistake. Less obvious is that encrypting them is also wrong for this purpose. Encryption is reversible by design: anyone with the key can recover every password, and the key usually lives somewhere near the data. If an attacker gets the database, there is a good chance they get the key too.',
        'What you want is a one-way function: a way to turn a password into a value you can check against later without ever being able to turn that value back into the password. When a user logs in, you apply the same function to what they typed and compare the result with the stored value. That one-way function is a hash — but not just any hash.'] },
      { h: 'Why ordinary hashes are the wrong tool', p: [
        'General-purpose cryptographic hash functions such as SHA-256 are designed to be fast. That is exactly what you want for checking file integrity or signing data, and exactly what you do not want for passwords. An attacker with a leaked database can try guesses at enormous speed, especially with graphics cards built for parallel computation, working through common passwords, dictionaries and variations in bulk.',
        'Older functions such as MD5 and SHA-1 are worse still, but the core problem is speed, not age. A password hash needs to be deliberately slow and, ideally, demanding of memory, so that each guess costs an attacker real time and money while a single legitimate login remains fast enough for a user not to notice.'] },
      { h: 'The functions designed for the job', p: [
        'Several algorithms exist specifically for password hashing. Argon2, and in particular the Argon2id variant, won the Password Hashing Competition in 2015 and is widely recommended today, including by the OWASP guidance on password storage. bcrypt is older, extremely widely deployed and still a reasonable choice. scrypt is another memory-hard option, and PBKDF2 with a high iteration count is used where particular compliance standards require it.',
        'All of these share a crucial feature: a configurable cost. You choose how much time and memory each hash takes, and you can raise the cost as hardware improves. The practical advice is to use a well-maintained library for your language that implements one of these algorithms, follow its current recommended parameters, and avoid writing any part of the cryptography yourself.'] },
      { h: 'Salts: why identical passwords must not look identical', p: [
        'If two users choose the same password and you hash it the same way, their stored hashes are identical, and an attacker who cracks one has cracked both. Worse, attackers can precompute hashes of common passwords once and reuse them against every database that hashes the same way.',
        'A salt solves both problems. It is a random value generated separately for each password and combined with it before hashing. The salt is not secret; it is stored alongside the hash. Because every user has a different salt, identical passwords produce different hashes, and precomputed tables become useless. Modern password hashing libraries generate and store salts automatically, embedding them in the output string, which is one more reason to use them rather than assembling your own scheme.'] },
      { h: 'Peppers: an optional extra secret', p: [
        'A pepper is a secret value added to every password before hashing, stored separately from the database — for example in a secrets manager or a hardware security module. If an attacker steals the database but not the pepper, the hashes are far harder to attack.',
        'Peppers add protection but also complexity: you must keep the secret safe, available to your application and backed up, and plan how to rotate it. Many teams treat a pepper as a useful extra layer once the basics — a proper password hashing function with unique salts — are firmly in place, never as a substitute for them.'] },
      { h: 'Upgrading old hashes without forcing resets', p: [
        'Systems often inherit weaker hashes from an earlier era. You cannot simply rehash the stored values with a better algorithm, because you do not know the original passwords. But you can upgrade gradually: when a user logs in successfully, you have their password in hand for a moment, so you can verify it against the old hash, then rehash it with the current algorithm and parameters and store the new value.',
        'Many libraries offer a function that tells you whether a stored hash uses outdated parameters, which makes this pattern easy to implement. For accounts that never log in, some teams wrap the old hash inside a new, stronger hash as an interim measure, and plan to force a reset for remaining legacy accounts.'] },
      { h: 'Details that matter in practice', p: [
        'Comparisons between hashes should be done with the library’s verification function, which uses constant-time comparison so that response timing does not leak information. bcrypt only uses the first 72 bytes of input, which matters for very long passphrases and for schemes that pre-combine a password with other data; the library documentation will describe how it handles this.',
        'Never log passwords, even accidentally — check request logging, error reports and debugging output. Do not impose low maximum password lengths or forbid special characters, which suggest you are storing passwords in a way that cares about their content. And make sure password reset tokens are random, single-use, short-lived and themselves stored hashed.'] },
      { h: 'Hashing is one layer of several', p: [
        'Good hashing limits the damage of a database leak, but it does not stop online guessing against your login form. Rate limiting, detection of credential-stuffing patterns, checks against lists of known breached passwords at registration, and multi-factor authentication all address that side of the problem.',
        'Increasingly, applications also offer passkeys, which remove shared secrets from the server altogether: the server stores a public key and the private key never leaves the user’s device. Where passwords remain, storing them properly is the baseline everything else builds on.'] },
      { h: 'Where the rule stops applying', p: [
        'Password hashing is for secrets that users choose and that you only need to verify, never read back. API keys and tokens you generate yourself are different: they are long and random, so a fast hash such as SHA-256 is usually acceptable for storing them, because brute-forcing a long random value is infeasible regardless of speed.',
        'And some secrets genuinely must be recoverable — credentials your application uses to call another service, for example. Those belong in a secrets manager and may need encryption, not hashing. The rule is precise: human-chosen passwords that only need verification get slow, salted password hashing; other secrets need the tool that fits their purpose.'] },
      { h: 'Choosing the cost parameters', p: [
        'The cost settings decide how slow each hash is, and they are a balance. Too low, and attackers can guess quickly; too high, and logins become slow and a burst of login attempts can overload your servers. A common approach is to choose parameters so that a single hash takes a noticeable fraction of a second on your production hardware, then measure it there rather than on a fast development machine.',
        'Memory-hard algorithms such as Argon2id also let you choose how much memory each hash uses, which makes specialised cracking hardware much less effective. Whatever you choose, record the parameters, review them periodically and raise them as hardware gets faster; the upgrade-at-login pattern lets you do that without disrupting users.'] },
      { h: 'Testing that it works', p: [
        'Password storage is easy to get subtly wrong and hard to notice, because logins still work either way. Add tests that check the stored value never equals the password, that two users with the same password get different stored values, that verification succeeds for the right password and fails for a wrong one, and that the stored format identifies the expected algorithm and parameters.',
        'It is also worth checking, once, what actually ends up in your logs, error reports and analytics during sign-up, login and password reset. Many real leaks come not from the password table but from a forgotten debug log that recorded request bodies.'] },
      { h: 'In short', p: [
        'Never store or encrypt passwords; hash them with a function built for passwords — Argon2id, bcrypt, scrypt or, where required, PBKDF2 — through a maintained library, with a unique salt per password and a cost tuned to current hardware.',
        'Verify with the library’s functions, upgrade old hashes at login, keep passwords out of logs, and add rate limiting, breached-password checks and multi-factor authentication around the login. Done properly, a stolen database becomes an expensive dead end for an attacker rather than a list of your users’ secrets.'] },
    ],
  },
  {
    slug: 'sql-injection-and-parameterized-queries',
    category: 'web',
    title: 'SQL Injection, Explained Properly: Why Parameterized Queries Work and Escaping Does Not',
    excerpt:
      'SQL injection is decades old and still turns up in new code, usually where a query is built from strings. How the attack actually works, why parameterized queries close it at the root, where ORMs still leave gaps, and the layers that limit the damage when something slips through.',
    date: '2026-10-13',
    minutes: 11,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'SQL injection has been understood for more than twenty years, appears in every list of common web vulnerabilities, and is still found in new code every year. It persists not because the fix is difficult — the fix is straightforward — but because the vulnerable pattern looks so natural: take some input, put it into a string, send the string to the database.',
        'This guide explains the mechanism from the ground up, so that the fix makes sense rather than being a rule to memorise. Once you see why the problem happens, it becomes easy to spot the places in a codebase where it can still creep in, including in code that uses an ORM and feels safe.'] },
      { h: 'The mechanism: data that becomes code', p: [
        'A database receives SQL as text and parses it into a command. When an application builds that text by concatenating fixed SQL with user input, the input becomes part of the command before the database ever sees it. If the input contains characters that are meaningful in SQL — a quote that ends a string, a keyword, a comment marker — the database has no way to know those characters came from a user rather than from the developer.',
        'That is the whole vulnerability: user-supplied data crossing the boundary into code. The same shape appears elsewhere — in shell commands, HTML, template engines and, more recently, in prompts sent to language models — which is why understanding it once pays off many times.'] },
      { h: 'A concrete case', p: [
        'Imagine a login check built by inserting the submitted username and password into a query string that selects a user whose name and password match. A user who types an ordinary name produces an ordinary query. But a user who types a name containing a quote, followed by a condition that is always true and a comment marker, can change the structure of the query so that the password check is cut off and the condition matches any row.',
        'The details vary between databases, but the principle does not: the attacker is not guessing a password, they are rewriting the question the application asks the database. Depending on how the query is built and what the database user is allowed to do, the same technique can read other tables, modify data or delete it.'] },
      { h: 'Why escaping is not the answer', p: [
        'An intuitive fix is to “clean” the input: escape quotes, strip suspicious characters, block keywords. This approach has a long history of failure. Escaping rules differ between databases, character encodings and contexts within a query; numbers, identifiers and strings need different handling; and attackers are endlessly inventive in finding the case a filter missed.',
        'Blocklists of dangerous words fail in a different way: they reject legitimate input, such as names and text containing apostrophes, while still missing the variants attackers use. Trying to make untrusted text safe to paste into code is fighting the problem at the wrong layer.'] },
      { h: 'Parameterized queries: keeping data as data', p: [
        'The real fix is to never mix data into the SQL text at all. With a parameterized query — often called a prepared statement — the application sends the SQL with placeholders where values will go, and sends the values separately. The database parses the command first, from the fixed text alone, and only then binds the values as data.',
        'Because the structure of the query is fixed before the values arrive, nothing in a value can change it. A username containing quotes and keywords is simply compared, literally, with the usernames in the table. This is why parameterized queries are not a filter that might miss something: they remove the mechanism the attack depends on. Every mainstream database driver supports them, and they should be the default for every query that includes a value from outside the code.'] },
      { h: 'The parts of a query that cannot be parameters', p: [
        'Placeholders can stand in for values, but usually not for structural parts of a query: table names, column names, sort directions or SQL keywords. This is where injection most often survives in modern code — a sort parameter from a URL inserted directly into an ORDER BY clause, or a column name chosen by the user for a filter.',
        'The safe pattern for these cases is an allowlist. Map the user’s choice to a fixed set of known-good identifiers in code — for example, accept only “name”, “date” or “price” and translate each to a specific column — and reject anything else. Never pass a user-supplied identifier into the query text, however it has been cleaned.'] },
      { h: 'ORMs and query builders: mostly safe, not automatically', p: [
        'Object-relational mappers and query builders generate parameterized SQL for their normal operations, which is a large part of why injection is less common than it once was. But almost every ORM also offers a way to run raw SQL or to insert raw fragments into an otherwise generated query, for the cases the abstraction does not cover.',
        'Those escape hatches are where vulnerabilities hide. A raw query built with string formatting is exactly as vulnerable inside an ORM as outside it. Most ORMs provide a parameterized form of their raw-query function; use it, and treat any string interpolation into SQL as a code-review red flag, whatever layer it appears in.'] },
      { h: 'Stored procedures are not a cure', p: [
        'It is sometimes said that stored procedures prevent injection. They help only if they are called with parameters and do not themselves build dynamic SQL from their inputs. A stored procedure that concatenates its arguments into a string and executes it is vulnerable in exactly the same way as application code that does so.',
        'The rule is the same everywhere: wherever SQL text is assembled, values must travel separately as parameters, and identifiers must come from an allowlist.'] },
      { h: 'Limiting the damage: least privilege', p: [
        'Defence in depth assumes that one day something will slip through. The database account your application uses should have only the permissions it needs: if the application never drops tables or reads the audit schema, its account should not be able to. Separate accounts for different services, and read-only accounts for reporting, shrink what any single injection can reach.',
        'Error handling matters too. Detailed database errors shown to users can reveal table names, query structure and versions that help an attacker refine an attack. Log full errors internally, and show users a generic message.'] },
      { h: 'Finding injection in existing code', p: [
        'Search the codebase for places where SQL strings are built with concatenation or formatting, and for uses of raw-query functions. Pay particular attention to dynamic sorting, filtering, search features, reporting tools and administrative pages, which are often written quickly and reviewed lightly.',
        'Static analysis tools and linters for many languages can flag string-built queries automatically, and security scanners can probe a running application. Neither replaces the habit of reviewing every query that includes outside input, but both catch mistakes that human reviewers miss on a busy day.'] },
      { h: 'Testing your own code', p: [
        'For each endpoint that takes input used in a query, write tests that pass values containing quotes, comment markers and SQL keywords, and assert that the application treats them as ordinary text: a search for a name with an apostrophe should find the person, not throw an error or return everything.',
        'Tests like these document the expected behaviour and guard against regressions when someone later “optimises” a query by building it as a string. They are cheap to write and turn an abstract security rule into something the build enforces.'] },
      { h: 'Where the rule stops applying', p: [
        'Parameterization protects the structure of a query, but it does not decide whether a user should be allowed to see or change the data the query touches. An endpoint that safely fetches an order by ID is still broken if it lets any user fetch any order by guessing IDs. Authorisation checks are a separate, equally important layer.',
        'And the principle extends beyond SQL. Shell commands should be run with argument arrays rather than built strings; HTML should be produced by templating systems that escape by context; and any system that combines instructions with untrusted text, including prompts to language models, needs the same suspicion about data that becomes code.'] },
      { h: 'Second-order injection', p: [
        'Injection does not always happen at the point where input arrives. In a second-order attack, a malicious value is stored safely — perhaps through a properly parameterized insert — and then later read back and inserted into a different query by code that assumes anything already in the database must be trustworthy.',
        'The lesson is that “trusted” is about where SQL text is built, not where data came from. Data read from your own tables, from configuration, from another internal service or from a file deserves exactly the same treatment as data from a form: values go in as parameters, identifiers come from allowlists.'] },
      { h: 'In short', p: [
        'SQL injection happens when user input is pasted into SQL text, letting data become part of the command. Escaping and blocklists try to fix the input and keep failing; parameterized queries fix the mechanism by sending values separately from the code.',
        'Use parameters for every value, allowlists for every identifier, the parameterized forms of ORM raw queries, least-privilege database accounts and generic error messages. Review string-built queries as red flags, test with hostile input, and remember that safe queries still need proper authorisation checks.'] },
    ],
  },
  {
    slug: 'backups-that-actually-restore',
    category: 'devops',
    title: 'Backups That Actually Restore: The 3-2-1 Rule, RPO, RTO and the Test Nobody Runs',
    excerpt:
      'A backup you have never restored is a hope, not a backup. What the 3-2-1 rule protects against, how to decide how much data you can afford to lose and how long you can be down, why snapshots and replicas are not enough, and how to prove that recovery works.',
    date: '2026-10-13',
    minutes: 11,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Almost every team believes it has backups. Far fewer have ever restored one under realistic conditions, timed how long it took and checked that the restored system actually worked. The gap between those two states is where data loss happens: a backup job that silently stopped months ago, a copy stored on the same system that failed, a restore that takes three days when the business can survive one.',
        'This guide covers the ideas that turn backups from a box ticked into a recovery you can rely on. None of it depends on a particular cloud provider or tool; the principles apply to a small project’s database as much as to a large company’s infrastructure.'] },
      { h: 'What you are actually protecting against', p: [
        'Backups exist for several different kinds of disaster, and a strategy that covers one may not cover another. Hardware or service failure destroys data where it lives. Human error deletes or corrupts data through a mistaken command, a bad migration or a buggy deploy. Malicious action, such as ransomware or a compromised account, deliberately destroys or encrypts data, often including any backups the attacker can reach. And regional disasters — fires, floods, prolonged outages — can take out an entire location.',
        'Listing these explicitly is the first step, because it reveals gaps. A replica in the same data centre protects against a failed disk, not against a deleted table, which is faithfully replicated within seconds, and not against an attacker with administrator access to both.'] },
      { h: 'The 3-2-1 rule', p: [
        'A long-standing rule of thumb summarises a resilient approach: keep at least three copies of your data, on at least two different types of storage or systems, with at least one copy off-site. The three copies mean a single failure never leaves you with nothing. The two different systems mean a single fault or bug in one kind of storage does not destroy every copy. The off-site copy means a disaster at one location does not take everything with it.',
        'A common modern extension adds that at least one copy should be offline or immutable — impossible to modify or delete for a set period, even by an administrator — and that backups should be verified with no errors. Immutability matters because attackers increasingly look for and destroy backups before triggering ransomware.'] },
      { h: 'RPO: how much data can you afford to lose?', p: [
        'The recovery point objective is the maximum amount of data, measured in time, that you can afford to lose. If you back up once a night and disaster strikes just before the next backup, you lose almost a day of changes. Whether that is acceptable depends entirely on the system: a blog may shrug it off, an online shop may lose a day of orders, a payments system cannot accept it at all.',
        'Agreeing the RPO with the people who own the business consequences, rather than choosing it from the technical side, is one of the most valuable conversations in operations. It decides how often you need backups and whether you need continuous approaches such as database transaction-log archiving, which allows recovery to a specific moment.'] },
      { h: 'RTO: how long can you be down?', p: [
        'The recovery time objective is how long the system can be unavailable before the damage becomes unacceptable. Restoring a large database from a remote copy, rebuilding servers and reconnecting services can take far longer than people assume, especially if it has never been practised.',
        'Measure it rather than guess. If a full restore takes ten hours and the agreed RTO is two, the strategy needs to change — perhaps keeping a warm standby, restoring the most important data first, or splitting systems so that critical parts recover quickly while less important parts follow.'] },
      { h: 'Snapshots and replicas are not backups on their own', p: [
        'Storage snapshots and database replicas are valuable tools, and they often form part of a backup strategy. But a snapshot that lives on the same storage system shares that system’s fate, and a replica copies every change from the primary, including accidental deletions and corruption, almost immediately.',
        'Treat them as fast recovery options for some failures, and keep independent backups — separate copies, on separate systems, with their own retention and access controls — for the failures they cannot help with.'] },
      { h: 'Backing up databases properly', p: [
        'Copying the files of a running database can produce a backup that cannot be restored, because the files change while the copy is in progress. Use the database’s own backup mechanisms: logical dumps that export data as statements or structured files, physical backups taken with tools designed for the engine, or managed backup features provided by a hosting platform.',
        'For a low RPO, combine periodic full backups with continuous archiving of the database’s transaction log, which allows point-in-time recovery: restoring to the moment just before a bad migration or an accidental deletion. Know which approach you use, how long backups are retained, and how far back you can actually go.'] },
      { h: 'Do not forget what is not in the database', p: [
        'Data lives in more places than the main database: uploaded files and object storage, configuration, secrets, search indexes, message queues, infrastructure definitions and the source code itself. Some of these can be rebuilt from other sources; others cannot.',
        'Make an inventory of every place that holds data you could not recreate, and decide for each how it is backed up and restored. Secrets and encryption keys deserve special care: an encrypted backup is useless if the key needed to decrypt it was stored only on the system that was lost.'] },
      { h: 'The test nobody runs', p: [
        'The only proof that backups work is a successful restore. Schedule regular restore tests: take a recent backup, restore it to a separate environment, start the application against it, and check that the data is complete and current — row counts, recent records, file attachments, everything a user would notice.',
        'Time the whole process and compare it with your RTO. Write down every step, every credential needed and every surprise, and turn those notes into a runbook. The first restore test almost always reveals something — a missing permission, an undocumented step, a backup that was smaller than expected — and it is far better to discover it on a quiet afternoon than during an outage.'] },
      { h: 'Monitoring and alerting', p: [
        'Backup jobs fail silently more often than people expect: credentials expire, storage fills up, a configuration change skips a database, a scheduler stops running. Monitor not only whether the job ran, but whether it produced a backup of plausible size and age, and alert when the most recent good backup is older than it should be.',
        'Review retention too. Keeping every backup forever costs money and may conflict with privacy obligations; keeping too few leaves you unable to recover from a problem that went unnoticed for weeks. A tiered approach — frequent recent backups, fewer older ones — is common.'] },
      { h: 'Access control for backups', p: [
        'Backups contain all your data, so they deserve at least the same protection as production. Restrict who and what can read them, encrypt them, and separate the credentials that can delete backups from those used by everyday systems. An attacker who compromises an application server should not be able to reach, alter or delete the backups.',
        'Immutable storage or write-once retention settings, offered by many storage services, provide a strong safeguard: even an administrator cannot delete protected backups until the retention period ends. Combined with an off-site copy, this protects against the scenario that most often destroys everything at once.'] },
      { h: 'Where the rules stop applying', p: [
        'Backups protect data, but they do not keep a service running during a failure; that is the job of redundancy, failover and high-availability design. A team that confuses the two may have excellent backups and still be offline for a day. Decide separately how you stay available and how you recover lost data.',
        'And backups cannot fix data that was wrong long before anyone noticed, beyond the reach of your retention. Validation, monitoring and careful migrations reduce how often you need to restore at all.'] },
      { h: 'A small project’s minimum', p: [
        'Not every project needs an elaborate system. For a small application, a sound minimum might be automated daily database backups with point-in-time recovery if the host offers it, a weekly export copied to storage with a different provider, uploaded files synced to a second location, and secrets kept in a password manager or secrets store that is itself backed up.',
        'Add a calendar reminder to perform a restore test every few months, and a short document describing how to do it. That modest setup already covers hardware failure, human error and the loss of a single provider, which is more than many much larger systems can honestly claim.'] },
      { h: 'In short', p: [
        'Keep at least three copies on two kinds of storage with one off-site, and make one immutable or offline. Agree RPO and RTO with the people who own the consequences, use the database’s own backup tools with point-in-time recovery where needed, and inventory every place that holds irreplaceable data, including keys and secrets.',
        'Above all, restore regularly, time it, document it and monitor that backups keep happening. A backup becomes real the first time you restore it on purpose.'] },
    ],
  },
  {
    slug: 'rate-limiting-token-bucket-explained',
    category: 'web',
    title: 'Rate Limiting Explained: Fixed Windows, Sliding Windows and the Token Bucket',
    excerpt:
      'Rate limiting protects services from overload, abuse and runaway clients — and done badly, it frustrates legitimate users or lets bursts straight through. How the common algorithms work, which trade-offs they make, and how clients should respond to a 429.',
    date: '2026-10-13',
    minutes: 11,
    author: 'The AXTO.dev Desk',
    sections: [
      { h: '', p: [
        'Every public endpoint will eventually receive more requests than it should: a buggy client stuck in a retry loop, a scraper, a credential-stuffing attack against a login form, or simply a popular moment. Without limits, one heavy user can slow the service for everyone, run up infrastructure costs or exhaust a downstream dependency.',
        'Rate limiting is the practice of capping how many requests a client may make in a given period. It sounds simple, and the first version usually is. The interesting part is in the details: how to count, how to treat bursts, what to key the limit on, how to enforce it across many servers and how clients should behave when they hit it. This guide walks through each.'] },
      { h: 'What to limit, and by whom', p: [
        'A limit needs a key: the identity whose requests are counted. Common choices are an API key or user account, an IP address, or a combination, sometimes with separate limits per endpoint. Authenticated identities are the most reliable keys; IP addresses are useful for anonymous traffic but imperfect, because many users can share one address and one attacker can use many.',
        'Different endpoints deserve different limits. A cheap read can tolerate far more traffic than an expensive search or report, and a login or password-reset endpoint needs strict limits to slow guessing attacks. Many systems combine a broad limit per client with tighter limits on sensitive or costly operations.'] },
      { h: 'Fixed window counters', p: [
        'The simplest algorithm divides time into fixed windows — each minute, say — and counts requests per key within the current window. When the count reaches the limit, further requests are rejected until the next window begins. It is easy to implement with a counter that resets on the window boundary.',
        'Its weakness is the boundary. A client can make the full allowance at the very end of one window and the full allowance again at the start of the next, briefly sending twice the intended rate. For many purposes that is acceptable; where bursts matter, smoother algorithms are better.'] },
      { h: 'Sliding windows', p: [
        'A sliding window log keeps a timestamp for every request and counts how many fall within the last interval — the last sixty seconds, for example — at the moment a new request arrives. It enforces the limit precisely and has no boundary problem, but storing a timestamp per request can be expensive for high-volume clients.',
        'A sliding window counter approximates the same behaviour cheaply. It keeps counts for the current and previous fixed windows and estimates the number of requests in the sliding interval by weighting the previous window’s count according to how much of it still overlaps. The result is much smoother than a fixed window, with only two counters per key.'] },
      { h: 'The token bucket', p: [
        'The token bucket is the algorithm most often used when bursts should be allowed but sustained rates controlled. Imagine a bucket that holds a maximum number of tokens and is refilled at a steady rate. Each request takes a token; if the bucket is empty, the request is rejected or delayed.',
        'The two parameters express two different promises: the refill rate is the long-term average a client may sustain, and the bucket size is how large a burst it may make after a quiet period. A client that has been idle can send a quick burst up to the bucket size, then is held to the refill rate. That matches real usage well — people and programs are bursty — while still protecting the service from sustained overload.'] },
      { h: 'The leaky bucket', p: [
        'The leaky bucket is a close relative often described as a queue that drains at a constant rate. Requests enter the queue and are processed at a fixed pace; if the queue is full, new requests are dropped. Where the token bucket permits bursts, the leaky bucket smooths output into a steady stream.',
        'That makes it useful for protecting a downstream system that cannot handle bursts at all, at the cost of added latency while requests wait in the queue. In practice the names are sometimes used loosely; what matters is whether you want to allow bursts or flatten them.'] },
      { h: 'Enforcing limits across many servers', p: [
        'A limit counted separately on each of ten application servers is effectively ten times larger than intended, and it behaves unpredictably as load balancers move traffic around. Distributed rate limiting needs a shared store for counters — commonly an in-memory data store that supports atomic increments and expiry — or enforcement at a single layer such as an API gateway or edge proxy.',
        'Atomicity matters: reading a counter, checking it and writing it back in separate steps creates a race in which concurrent requests all pass. Use atomic increment operations or scripts that run as a single step in the store. And decide what happens if the store is unavailable: failing open keeps the service up but removes protection, failing closed protects dependencies but blocks users. Choose deliberately per endpoint.'] },
      { h: 'Telling clients what happened', p: [
        'The standard HTTP response for a client that has sent too many requests is status 429, Too Many Requests. Include a Retry-After header indicating how long the client should wait, either as a number of seconds or a date, so that well-behaved clients can back off precisely rather than guessing.',
        'Many APIs also return headers describing the limit, the remaining allowance and when it resets, so that clients can pace themselves before hitting the wall; work on standardising such headers is ongoing, so document whatever format you use. A clear error body explaining the limit and linking to documentation saves your users and your support team a lot of confusion.'] },
      { h: 'How clients should respond', p: [
        'If you are writing the client, treat a 429 as an instruction, not an error to retry immediately. Respect Retry-After when it is present. When it is absent, retry with exponential backoff — doubling the wait after each failure up to a maximum — and add random jitter so that many clients that failed at the same moment do not retry at the same moment and cause another spike.',
        'Make retries safe, too. Retrying a request that creates something, such as a payment or an order, can duplicate it unless the API supports idempotency keys. And put a cap on total retries, so that a client facing a long outage gives up gracefully rather than hammering the service indefinitely.'] },
      { h: 'Choosing limits that make sense', p: [
        'Set limits from data rather than guesses. Look at how real clients use the API — typical request rates, peaks, the heaviest legitimate users — and set limits comfortably above normal behaviour but well below what would harm the service. Start in a monitoring-only mode that logs who would have been limited, review the results, then enforce.',
        'Revisit limits as usage grows, and offer a route for legitimate users who need more, such as higher limits for paid plans or on request. Limits that block real customers without explanation create support burden and churn; limits that are too generous provide no protection when you need it.'] },
      { h: 'Where rate limiting stops helping', p: [
        'Rate limiting controls how fast a single identity can act, but large distributed attacks spread requests across many addresses and accounts, each staying under the limit. Defending against those needs additional layers: network-level protection, bot detection, challenges for suspicious traffic and capacity planning.',
        'Rate limiting is also not a substitute for making expensive operations efficient, for authentication and authorisation, or for proper queueing of heavy work. It is a guard rail that keeps a healthy system healthy under pressure, not a cure for a system that cannot handle its normal load.'] },
      { h: 'Protecting login and password-reset endpoints', p: [
        'Authentication endpoints need limits keyed on more than one thing. Limiting by IP address alone lets an attacker spread guesses across many addresses; limiting by account alone lets an attacker lock a real user out simply by failing logins for that account on purpose. A common pattern combines a per-address limit, a per-account limit that slows rather than locks — growing delays after repeated failures — and broader monitoring for many failures across many accounts from related sources.',
        'Password-reset and verification-code endpoints deserve the same care, because each request may send an email or a text message that costs money and can be used to harass someone. Limit how often a reset can be requested for one address, keep codes short-lived and single-use, cap the number of guesses per code, and return the same response whether or not the account exists, so that the endpoint does not reveal which addresses are registered.'] },
      { h: 'Testing your rate limiter', p: [
        'Rate limiting code is easy to get subtly wrong, so test it directly. Unit-test the algorithm with a controllable clock rather than real time, so that you can step precisely across window boundaries and refill moments. Check the edges: exactly at the limit, one request over it, the first request after a reset, a long idle period followed by a burst, and many concurrent requests arriving at once against a shared counter.',
        'Then test the behaviour end to end. Send a burst against a staging environment and confirm that the right requests are rejected, that 429 responses carry a sensible Retry-After value, and that the limit still holds when traffic is spread across several servers. Keep watching in production as well: a metric for rejected requests per endpoint makes problems visible, and a sudden rise can mean an attack, a broken client or a limit that no longer fits real usage.'] },
      { h: 'In short', p: [
        'Choose a key for each limit, set different limits for cheap, expensive and sensitive endpoints, and pick an algorithm that matches the behaviour you want: fixed windows for simplicity, sliding windows for smoothness, the token bucket for controlled bursts and the leaky bucket for a steady flow.',
        'Enforce limits atomically in a shared store or at the edge, return 429 with Retry-After and clear documentation, and make clients back off with jitter and retry safely. Set limits from real usage, monitor before enforcing, and remember that rate limiting is one layer of protection among several.'] },
    ],
  },
];
