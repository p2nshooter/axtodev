import type { Article } from './types';

/**
 * Text added to existing articles. Nothing already written is merged, moved
 * or deleted.
 *
 * Owner: "artikel d tambah bukan d gabung" — add to the articles, do not
 * combine them. Consolidation (merges.ts) is switched off; this is the
 * replacement plan. Each entry below appends new sections to ONE existing
 * article, found by its slug. The article keeps its own URL and every
 * sentence anyone already wrote; the new sections are added on the end.
 *
 * WHY A TITLE CHANGE IS THE ONE EXCEPTION. Nine articles in the library share
 * the identical title "The Power of Syscall Abstraction: Simplifying
 * Low-Level System Interactions", word for word — the content bot's
 * duplicate-title guard fires by generating a NEW slug for a title it already
 * used, not by producing a different title, so nine near-identical drafts
 * accumulated under nine URLs. A title cannot be the same sentence nine times
 * over on one site; that is itself a duplicate-content signal independent of
 * word count. So the nine below are each given a distinct title that names
 * the specific angle its new sections take — the existing prose is not
 * touched, only what the whole piece is now actually about is named honestly.
 *
 * EACH OF THE NINE GOES SOMEWHERE DIFFERENT ON PURPOSE, so that what were
 * nine copies of the same five paragraphs become nine articles that do not
 * overlap: the boundary itself, where the abstraction leaks, its performance
 * cost, what libc specifically wraps, how to test code that crosses it, how
 * the two major operating system families differ, syscall filtering as a
 * security boundary, the evolution from select() to io_uring, and how four
 * language runtimes hide the boundary from application code. Two articles
 * that each go deep in a different direction are not duplication. Two that
 * each skim the same four hundred words are.
 */

export interface Expansion {
  slug: string;
  /** Only set when the existing title collides with another live article. */
  title?: string;
  excerpt?: string;
  /** Sections appended after whatever the article already has. */
  sections: Article['sections'];
}

export const EXPANSIONS: Expansion[] = [
  // ── the syscall cluster: nine articles, nine directions ───────────────────
  {
    slug: 'syscall-abstraction',
    title: 'What a System Call Actually Is: Crossing the Kernel Boundary',
    excerpt:
      'A syscall is not a slower function call. It is a controlled crossing into a different privilege level, with its own calling convention and its own cost — and knowing the mechanism explains why the abstraction exists at all.',
    sections: [
      {
        h: 'The boundary a function call does not cross',
        p: [
          'An ordinary function call stays inside the same privilege level the whole time: the same code can read the same memory, and returning is just a jump back to the saved address. A system call is different in kind, not just in cost, because the kernel runs at a higher privilege level than application code and for a good reason — it is the one piece of software on the machine that is allowed to touch hardware directly, manage other processes, and enforce the isolation between them. Application code cannot simply jump into kernel code the way it jumps into a library function, because that would mean any program could execute arbitrary kernel logic with arbitrary arguments, and the whole point of having a kernel is that it does not trust application code that much.',
          'So the processor provides a narrow, deliberate doorway instead of an open one: a special instruction whose entire job is to say "switch to kernel mode and jump to exactly one place the kernel has designated for this, and nowhere else." Everything about syscall abstraction, at every level above this, exists to manage what happens at that one doorway.',
        ],
      },
      {
        h: 'How the crossing actually happens',
        p: [
          'On x86-64 Linux, the convention is concrete enough to describe exactly: the syscall number goes in one register (rax), up to six arguments go in a fixed set of others, and the syscall instruction traps into the kernel, which reads those registers, validates them, dispatches to the internal function that implements that syscall, and writes a return value back into a register before switching the processor back to user mode and resuming. ARM has its own equivalent instruction and its own register convention; every architecture Linux supports has one, and they are not the same convention, which is precisely why a raw syscall is not portable across architectures even when the operating system is identical.',
          "The kernel's own convention for signalling failure is a small negative integer rather than an exception, and it is libc that translates that into the pattern C programmers actually see — a return value of -1 with a separate errno variable holding the reason. That translation is not decoration; it is the first layer of syscall abstraction, and it exists before any library or framework gets involved.",
        ],
      },
      {
        h: 'Why it is not just "a slower function call"',
        p: [
          "The mode switch itself carries real cost that a same-privilege function call never pays: the processor has to change privilege level, and depending on the platform's mitigations, that transition can also mean flushing speculative execution state and invalidating parts of the translation lookaside buffer. After the Meltdown vulnerability in 2018, most operating systems added kernel page-table isolation, which keeps the kernel's page tables largely separate from the user process's as a security measure — and one of its known, accepted trade-offs is that it makes the user-to-kernel transition on every syscall measurably more expensive than it was before, on affected hardware. None of that is visible in source code; a read() call looks identical to a function call and behaves nothing like one underneath.",
          "This is why syscall-heavy code — a tight loop that writes one line at a time, a parser that reads one byte at a time from a file — can dominate a profile even though every individual call succeeds instantly from the caller's point of view. The cost is not failure, it is the toll charged just for making the crossing, paid whether or not anything goes wrong.",
        ],
      },
      {
        h: 'What the abstraction actually buys back',
        p: [
          "Given all of that — a different instruction per architecture, a different register convention, a real performance cost, and a failure signal that is not the language's native exception mechanism — the case for an abstraction layer is not convenience, it is that the raw interface is simply not something application code should be written against directly. A C program that calls read() is written once and compiles for x86-64, ARM64, and everything else libc supports, because libc is the layer that knows which instruction and which registers each target needs. Strip that layer away and every syscall site in a codebase becomes architecture-specific.",
          'That is the whole shape of syscall abstraction in one sentence: a narrow, expensive, architecture-specific doorway on one side, and a portable, ordinary-looking function call on the other, with a translation layer in between whose entire job is to make sure application code never has to know which architecture it is standing on.',
        ],
      },
      {
        h: 'Syscall numbers are not portable — only the source is',
        p: [
          "It is worth being specific about exactly what does and does not travel across platforms, because the phrase \"syscall abstraction\" can make it sound like there is one underlying table everyone secretly agrees on. There is not. The number that means \"read a file\" on x86-64 Linux is a different integer from the number that means the same thing on ARM64 Linux, which is in turn unrelated to whatever number, if any, means something similar on a BSD or on Windows' native API. What is portable is the source code — the call to read() — because libc, compiled separately for each target, is the thing that resolves that call down to whichever number and register layout its specific platform actually expects.",
          "This is also why a statically linked binary is architecture-bound in a way that plain C source is not: the numbers get baked in at compile time, for one specific target, and a binary built for x86-64 has no path to correctness on ARM64 no matter how portable the original source was — it would need to be rebuilt, not merely copied, because the table it silently agreed to at compile time does not exist on the new hardware.",
        ],
      },
      {
        h: 'Why the kernel copies your data instead of just reading it',
        p: [
          "A syscall that passes a buffer — write() handing over the bytes to send, read() handing over a destination to fill — does not let the kernel simply dereference the pointer a program supplied and start using it, even though that pointer is, from the kernel's point of view, just an address like any other. The kernel instead copies the data across the boundary through dedicated, carefully checked routines, validating that every address involved genuinely belongs to the calling process before touching it. A program is not a trusted party here: a buggy or malicious call could otherwise hand the kernel a pointer into memory it has no business touching, or into another process's address space entirely, and ask the kernel — which runs with full privilege — to read or write there on its behalf.",
          "This is precisely why the vDSO, discussed in the sibling article on syscall cost, is worth calling out as the deliberate exception rather than the rule: it works by mapping kernel-provided data directly into the process's own memory so no crossing, and therefore no copy, is needed at all for the handful of calls it covers. Every other syscall pays for that validation and that copy specifically because the alternative — trusting a user-supplied address without checking it — is not a corner worth cutting, however much it would save.",
          "The validation step itself has to be genuinely careful rather than a quick sanity check, because the address being validated and the address actually used could, in principle, be made to differ between the check and the use if a second thread in the same process is racing to modify the same memory region at exactly that moment — a class of bug categorised under time-of-check-to-time-of-use, and one more reason the copying routines at this boundary are among the most heavily scrutinised code in the entire kernel rather than a place implementers reach for the obvious-looking shortcut.",
        ],
      },
      {
        h: 'Why tracing tools sit at exactly this boundary',
        p: [
          "The reason strace, ptrace-based debuggers and modern eBPF-based tracers all attach at the syscall boundary specifically, rather than somewhere inside a language runtime, is that this is the one place every meaningful interaction with the kernel is guaranteed to funnel through, regardless of which language or framework produced the program. A Python process, a Go binary and a C program making the same underlying file access all cross the identical trap instruction to do it, which means a tool built to watch that one doorway can describe what any of them are really doing without needing to understand any of their source languages at all.",
          "This is part of why strace remains one of the fastest ways to debug a mysterious failure regardless of what the program is written in: it does not need to know anything about the application's code, only about the syscalls crossing the boundary and the arguments and return values attached to each one — which is usually enough, on its own, to see exactly which file, which permission, or which network address a program was actually trying to reach when it failed.",
        ],
      },
      {
        h: 'From a software interrupt to a dedicated instruction',
        p: [
"Older x86 Linux made the trap into the kernel using int 0x80, a general-purpose software-interrupt instruction never designed specifically for this job; it worked, and it was slower than it needed to be, because a generic interrupt mechanism carries more overhead than a mechanism purpose-built for one task. x86-64 replaced it with a dedicated syscall instruction whose only job is this exact crossing, and the older int 0x80 path survives today mainly for 32-bit compatibility rather than as the primary route.",
"This history is a small, concrete example of a pattern that recurs throughout computing: a general mechanism gets pressed into service for something specific, works well enough to become the default, and eventually gets replaced by hardware or an interface purpose-built for exactly that one job once the traffic through it justifies the investment \u2014 which is also, not coincidentally, the same shape as the select-to-io_uring evolution covered elsewhere in this cluster of articles.",
"Intel's own intermediate attempt, the sysenter/sysexit pair introduced for 32-bit mode, tells the same story from a different angle: it was faster than int 0x80 but was itself superseded once x86-64 standardised on syscall/sysret as the single, purpose-built path \u2014 two successive generations of hardware each narrowing the same doorway to do less unrelated work and do the one job it exists for more cheaply.",
        ],
      },
    ],
  },
  {
    slug: 'syscall-abstraction-abg4',
    title: 'Where Syscall Abstraction Leaks: Partial Reads, EINTR and errno',
    excerpt:
      'The abstraction hides the mechanism, not the edge cases. Four places where the raw behaviour of a system call still shows through code that thinks it is dealing with something simpler than it is.',
    sections: [
      {
        h: 'The partial read nobody\'s first draft handles',
        p: [
          "Ask for four thousand bytes from a file or a socket and read() is entitled to give you fewer — one byte, a few hundred, whatever happened to be available at that instant — and that is not an error, it is the documented contract. A pipe can be interrupted mid-stream, a socket can deliver a partial TCP segment before more data arrives, and even an ordinary local file read can be cut short by a signal. Code that treats the return value as \"the number of bytes I asked for, unless something is wrong\" works in every manual test and fails the first time it meets a slow network or a large enough file, because the two situations look identical from inside a debugger running on localhost.",
          'The correct pattern is to loop until the requested amount is read or an actual end-of-file or error is reported, and it is worth writing that loop once, in one place, rather than trusting every call site to remember. This single mismatch between the intuition and the actual contract is responsible for a disproportionate share of protocol-parsing bugs that only appear in production.',
        ],
      },
      {
        h: 'EINTR: the syscall that got interrupted',
        p: [
          "A signal can arrive while a process is blocked inside a slow syscall — waiting on a read, a wait(), a lock — and on POSIX systems the historical behaviour is that the syscall returns early with EINTR rather than silently resuming. That decision, made decades ago, means a program has to explicitly decide what to do when its blocking call gets interrupted by something as mundane as a terminal resize or a timer, and the wrong instinct is to treat EINTR as a real failure and give up.",
          'Most systems now offer SA_RESTART, a flag that asks the kernel to automatically restart certain interrupted syscalls rather than returning EINTR at all, and many modern libraries set it by default — which is part of why EINTR feels like a historical curiosity rather than a live concern. It stops being historical the moment a codebase installs a custom signal handler without knowing that flag exists, at which point EINTR reappears exactly where a portability bug always used to live.',
        ],
      },
      {
        h: 'errno is not the variable it looks like',
        p: [
          'errno reads like an ordinary global, and on a single-threaded program decades ago it effectively was one — which is exactly the design that stopped working once threads arrived, because a genuinely global variable shared by every thread would let one thread\'s failed syscall silently overwrite the error another thread was about to check. The fix, baked into every POSIX-compliant libc since, is that errno is thread-local: each thread sees its own value, typically implemented as a macro that calls a function returning a pointer into thread-local storage rather than a plain variable access.',
          'The practical trap that survives all of this machinery is timing, not threading: errno is only meaningful immediately after a call that actually failed, and any intervening libc call — even one that looks completely unrelated, like a logging statement — is free to overwrite it. Code that checks a return value, does something else, and only then inspects errno is reading a value that may belong to a different call entirely.',
        ],
      },
      {
        h: 'The file descriptor table has a ceiling',
        p: [
          "Every open file, socket and pipe holds a file descriptor, and every process has a limit on how many it may hold open at once — visible on the command line as ulimit -n and enforced by the kernel as RLIMIT_NOFILE. Code that opens a connection per request and forgets to close it on every exit path, including the error paths, leaks descriptors slowly enough that nothing looks wrong for hours, until the process hits its ceiling and every subsequent open call starts failing with EMFILE.",
          'The reason this bug is so persistent in practice is that the syscall abstraction that hides everything else about descriptors — they behave, for the most part, like small portable integers you pass around — hides this ceiling just as effectively, right up until it does not. Servers under real load raise the limit deliberately and still leak descriptors if the close path is not exercised by every branch, which is why descriptor leaks are one of the classic things a long-running load test finds that a quick manual check never will.',
        ],
      },
      {
        h: 'Non-blocking sockets: the difference between "less than you asked" and "nothing at all"',
        p: [
          "The partial-read discussion above is about a blocking descriptor, where a short return still means real data arrived. Set a socket to non-blocking mode and a fourth outcome becomes possible that looks superficially similar and means something different: the call returns immediately with EAGAIN, or the equivalent EWOULDBLOCK, meaning no data is available right now at all, not that some data arrived and the rest is still coming. Code that treats EAGAIN as a partial read, or as a real error, either busy-loops pointlessly or gives up on a connection that was perfectly healthy and simply had nothing to say at that instant.",
          "This distinction is exactly what an event loop built on epoll or kqueue is designed around: a descriptor is not polled speculatively hoping for data, it is only read after the kernel has already reported it ready, which is what makes EAGAIN on a non-blocking socket rare in well-structured code and a reliable signal of a logic error — usually a read attempted outside the readiness notification that was supposed to gate it — when it does show up.",
        ],
      },
      {
        h: 'Signal-safety: what a handler is actually allowed to do',
        p: [
          "The EINTR discussion above assumes a signal handler exists and does something; it is worth being specific about what a handler is safely allowed to do, because the answer is much narrower than intuition suggests. A signal can interrupt a program at literally any instruction, including in the middle of a call to malloc or printf, and if the handler itself then calls malloc or printf, it can re-enter code that was already partway through modifying shared state — the classic definition of a reentrancy bug, except triggered by the operating system rather than by concurrent threads.",
          "This is why the list of functions POSIX guarantees are safe to call from a signal handler is short and deliberately unglamorous: things like write() to a file descriptor and a handful of others, explicitly excluding most of what a normal function would reach for. The common, correct pattern is for a handler to do almost nothing itself — set a flag, or write a single byte to a pipe the main program is watching — and let the real work happen back in ordinary, non-interrupted code once the main loop notices.",
        ],
      },
      {
        h: 'The one syscall you should not blindly retry on EINTR',
        p: [
"The general rule earlier in this article \u2014 retry a syscall interrupted by EINTR \u2014 has a well-documented exception that catches people specifically because it looks like every other case: close(). On Linux, once close() has been called, the file descriptor is released from the calling process regardless of whether the call itself reports EINTR, which means retrying it after seeing EINTR risks closing a completely different, newly opened file that has since been assigned the same descriptor number by the kernel.",
"This single exception is documented in the close(2) manual page precisely because the natural instinct \u2014 wrap every syscall in the same interrupted-retry loop \u2014 is wrong here in a way that does not fail loudly. The safe response to EINTR from close() is simply to treat the descriptor as closed and move on, not to call close() again on the same number.",
"It is worth noting that this particular hazard has become rarer to meet directly as the industry has moved up the stack: a C program managing raw file descriptors by hand can walk straight into it, while a Python or Go program closing a file through its standard library is relying on that library's own wrapper to have already gotten this exact detail right, which is one more instance of the same pattern this whole cluster keeps returning to \u2014 the abstraction earning its keep precisely at the edge cases most first drafts get wrong.",
        ],
      },
      {
        h: 'Why this is rarer to meet directly today than it used to be',
        p: [
"None of the four traps above have gone away at the level the kernel operates, and all four are still exactly as real for anything written directly against the raw syscall layer. What has changed is how much application code sits directly on that layer any more: a Go, Python or Rust program reading a file is almost always going through a standard-library function that has already encoded the correct retry loop, the correct EINTR handling, and the correct interpretation of a partial result, so the program above it never has to reason about the four traps individually unless it is doing something unusual enough to bypass that layer.",
"This is the syscall abstraction argument from earlier in this cluster of articles playing out concretely: the raw interface did not get any gentler, the layer standing between most programmers and that interface simply got thicker and more careful, one bug report at a time, until the four traps above became something a library author has to know rather than something every caller has to rediscover.",
        ],
      },
    ],
  },
  {
    slug: 'syscall-abstraction-bjgd',
    title: 'The Real Cost of a System Call: Context Switches and the vDSO',
    excerpt:
      'A syscall is not free, and the industry has spent decades building ways around paying for it on every operation — from a kernel that fakes the call entirely to a queue design that removes most of the calls altogether.',
    sections: [
      {
        h: 'What the mode switch actually costs',
        p: [
          'Every syscall pays for the privilege-level switch itself, independent of whatever work the syscall goes on to do — and that switch is dramatically more expensive than a same-privilege function call, though far cheaper than switching the processor to run an entirely different process. Part of the cost is unavoidable mechanics: saving and restoring register state, validating the request. Part of it, on modern hardware, is the security mitigations added after speculative-execution vulnerabilities were discovered — kernel page-table isolation in particular adds real overhead specifically to the user-to-kernel and kernel-to-user transitions, because it deliberately keeps the two sets of page tables from overlapping in ways attackers had exploited.',
          'None of this shows up as a correctness problem. A million individual syscalls all succeed. What shows up is a profile where a program appears to spend real time simply crossing a boundary it crosses too often, and the fix is never to make the crossing faster — it is to cross it less.',
        ],
      },
      {
        h: 'The vDSO: syscalls the kernel fakes for you',
        p: [
          "Some syscalls are called so often, for information that changes so predictably, that the kernel maps a small piece of itself directly into every process's address space so the call can be answered without a mode switch at all. clock_gettime() and gettimeofday() are the standard example: on Linux this mechanism is called the vDSO, and it lets a program read the current time as an ordinary userspace memory access, with the kernel keeping that memory current in the background, rather than trapping into the kernel millions of times a second for something a busy server's logging and tracing code asks constantly.",
          "This is the abstraction working exactly as intended, and invisibly: the calling code still writes clock_gettime() and gets a syscall-shaped return value, with no idea that no privilege switch happened at all. It is one of the few places where the industry solved the cost of a syscall by making it stop being a syscall in the cases where the cost mattered most.",
        ],
      },
      {
        h: 'Batching to amortise the cost',
        p: [
          "Where the vDSO trick does not apply — most syscalls genuinely do need the kernel to do something, not just report a value — the remaining lever is doing more work per crossing instead of fewer crossings for the same work. readv() and writev() gather or scatter several buffers in one call instead of one call per buffer. io_uring goes further: user space and the kernel share ring buffers directly, so a program can submit many operations and later collect many completions without a syscall for each individual one, collapsing what used to be one mode switch per operation into a small, mostly fixed number regardless of how many operations are in flight.",
          "The pattern across all of these is the same lesson stated differently: the cost lives in how many times the boundary is crossed, not in how much data crosses it. A single syscall moving a large buffer is close to free relative to its data volume; a thousand syscalls each moving one byte pay the crossing cost a thousand times over for the same total transfer.",
        ],
      },
      {
        h: 'When the cost actually matters',
        p: [
          'For the overwhelming majority of application code, none of this is worth thinking about: opening a handful of files, making a handful of network requests, and calling it a day pays the syscall cost a handful of times, which is nothing next to everything else the program does. It becomes worth caring about specifically in hot loops — a logger that calls write() once per line instead of buffering and flushing, a hand-rolled protocol parser that reads one byte at a time instead of into a buffer — where the same crossing happens far more often than the work being done would otherwise justify.',
          "The habit that generalises is simple: buffer in user space, and cross the boundary in batches. It is the same idea stdio's own buffering was built around, it is why readv/writev and io_uring exist, and it is the one thing worth checking first whenever a profiler points at time apparently spent \"in the kernel\" for work that does not look like it should need much of it.",
        ],
      },
      {
        h: 'Why it shows up as "system time", not "user time"',
        p: [
          "Most operating systems split the CPU time a process consumes into two buckets, and both the time command and tools like top report them separately: user time is work the CPU did executing the program's own instructions, and system time is work it did executing kernel code on the program's behalf — which is to say, time spent on the far side of exactly the boundary this whole cluster of articles is about. A program that is unexpectedly slow and shows a high proportion of system time relative to user time is, in effect, telling you where to look before a single line of application code has been read: it is spending its time crossing into the kernel, not computing.",
          "This is one of the fastest, cheapest diagnostics available for exactly the syscall-cost problem described above, because it requires no code changes and no instrumentation — only running the program under a tool that already ships with the operating system and reading a number that is usually printed by default. A sudden jump in system time between two versions of the same program is a strong, specific hint that something in the newer version is crossing the kernel boundary more often than it used to, well before a profiler narrows down exactly which call site is responsible.",
        ],
      },
      {
        h: 'Why the same mitigation costs more on some workloads than others',
        p: [
          "Kernel page-table isolation, mentioned earlier as the source of extra per-syscall overhead since 2018, does not cost the same amount for every program, because its overhead is paid per crossing rather than per unit of useful work done during that crossing. A program that makes few syscalls, each doing a large amount of work — a big sequential file copy, say — barely notices the mitigation, because the fixed cost of each crossing is a small fraction of the total time that crossing accomplishes something. A program that makes many small syscalls doing very little work each pays the same fixed cost far more often relative to what it gets done, which is exactly why database engines and networking libraries, historically syscall-chatty by nature, were among the workloads that measured the largest relative slowdowns when these mitigations first shipped.",
          'This asymmetry is a specific, concrete instance of the general lesson already stated: the cost lives in how many times the boundary is crossed, not in how much work happens on either side of it — and a security mitigation that adds a fixed tax per crossing will always be felt most by exactly the code that was already crossing too often.',
        ],
      },
      {
        h: 'Why an ordinary container does not change this cost at all',
        p: [
"It is worth being precise about what containers do and do not change here, because \"containerised\" sounds like it should mean \"virtualised\" and the two are not the same thing. An ordinary container shares the host's kernel directly \u2014 its isolation comes from namespaces and cgroups partitioning what the process can see and how much of the host's resources it may use, not from running a separate kernel underneath. A syscall made by a process inside a container crosses exactly the same boundary, at exactly the same cost, as the identical syscall made by a process running directly on the host.",
"A full virtual machine is a genuinely different case: a syscall there can involve an additional trap out of the guest kernel entirely, to the hypervisor, before the host kernel is even involved \u2014 a second boundary stacked on top of the first one. That extra hop is real overhead containers were specifically designed to avoid, which is a meaningful part of why containers start faster and run syscall-heavy workloads more cheaply than an equivalent virtual machine.",
"A hardware virtual machine's extra hop has its own name and its own hardware support \u2014 VT-x on Intel, AMD-V on AMD \u2014 with a VMEXIT and VMENTRY marking the guest's own trap out to the hypervisor and back, conceptually the same kind of privilege-boundary crossing this entire article has been describing, just one layer further out. Recognising the parallel is what makes the container-versus-VM performance difference intuitive rather than a fact to memorise: a container pays the syscall cost once, a VM can pay it twice.",
        ],
      },
      {
        h: 'A rule of thumb for when to stop worrying about this',
        p: [
"Given everything above, the practical filter worth applying to any piece of code is simple: does it make a syscall inside a loop whose iteration count scales with input size or request volume? If the answer is no \u2014 a handful of files opened once at start-up, a handful of requests handled per user action \u2014 the cost described throughout this article is not worth a single line of extra complexity to avoid. If the answer is yes, that loop is exactly where buffering, batching, or one of the newer interfaces discussed above earns its keep, and it is usually the only place in a given codebase where it does.",
        ],
      },
    ],
  },
  {
    slug: 'syscall-abstraction-101',
    title: 'Syscall Abstraction in the C Standard Library: What glibc Actually Wraps',
    excerpt:
      'The functions C programmers call every day are not the syscalls themselves. They are a thin, and sometimes not so thin, wrapper — and knowing exactly what the wrapper does explains buffering, static linking, and why musl and glibc occasionally disagree.',
    sections: [
      {
        h: 'The wrapper between your code and the kernel',
        p: [
          "open(), read(), write() and their relatives, as called from C, are not the syscall — they are a small function in the C library that sets up the syscall number and arguments in the registers the processor's trap instruction expects, executes that instruction, and translates the kernel's raw return convention into the return-value-plus-errno pattern C code actually checks. The function name and the syscall it wraps usually share a name, which is precisely what makes it easy to forget they are two different things: one is a library call at the ordinary calling convention, the other is a privilege-level crossing with an entirely different one, and the wrapper's whole job is bridging that gap so the caller never has to know it exists.",
          'This is also where portability actually lives in practice: the same open() call in source code compiles against a completely different syscall number and, on some platforms, an entirely different table, depending on which libc and which architecture the code is built for — none of which the C source has to encode, because the wrapper is what varies underneath it.',
        ],
      },
      {
        h: 'Why the wrapper adds buffering on top',
        p: [
          "The stdio functions — fopen, fread, fwrite, fprintf — sit a layer above the thin open/read/write wrappers, and the reason they exist as a separate layer is buffering: writing one character at a time straight through write() means one syscall per character, which is exactly the cost problem syscalls carry. fwrite() instead accumulates output in a userspace buffer and only calls write() when that buffer fills or is explicitly flushed, trading a small amount of memory for collapsing many syscalls into one.",
          'This is also the source of a specific, recurring class of bug: mixing raw write() calls with stdio\'s buffered functions on the same file descriptor can interleave output in an order that looks wrong, because the buffered writes have not necessarily reached the kernel yet when the raw call fires. The fix is not mysterious once the two layers are visible as genuinely separate things rather than interchangeable ways to write a file.',
        ],
      },
      {
        h: 'Static vs dynamic linking changes the contract',
        p: [
          "The Linux kernel makes a strong, long-standing promise not to break its syscall-numbering ABI for existing syscalls — a binary built years ago can still make the same raw syscalls on a current kernel. What is not guaranteed to stay the same is the C library's own ABI above that layer, which is why a binary linked dynamically against one glibc version can fail to run against a much older or newer one if symbol versions have moved, while a statically linked binary, having baked its own copy of the wrapper code in, keeps working regardless of what libc the host has installed at all.",
          'This is one of the real reasons container images built on Alpine use musl instead of glibc: musl is smaller and simpler, which is attractive for image size, but it is not a drop-in behavioural twin — DNS resolution behaviour, locale handling and a handful of other corners differ enough that software tested only against glibc has occasionally shipped subtly broken on musl-based images, purely because two different implementations of the same wrapper layer do not have to agree on every detail beyond the syscalls they both ultimately call.',
        ],
      },
      {
        h: 'What happens when the wrapper is not there at all',
        p: [
          "Go's runtime historically made many of its Linux syscalls directly, without routing through glibc the way C programs do, which is a large part of why Go binaries are famously easy to produce as a single static executable with no runtime dependency on the host's C library. The trade-off showed up in one specific place: hostname resolution on Linux traditionally depends on NSS, glibc's pluggable mechanism for consulting DNS, /etc/hosts, and other sources — which is implemented as dynamically loaded glibc modules, something a binary that bypasses glibc cannot use the same way. Go's standard library has to choose, per platform and configuration, between its own pure-Go resolver and falling back to the system's C resolver, and that choice has been a source of real, debugged-in-production differences in lookup behaviour between otherwise-identical builds.",
          'The lesson generalises past Go specifically: the wrapper layer is not a formality. Skipping it buys independence from a particular library version, and it can quietly opt code out of behaviour, like NSS-based name resolution, that most programmers assume is simply part of what "making a network connection" means on Linux.',
        ],
      },
      {
        h: 'When the wrapper is behind the kernel instead of ahead of it',
        p: [
          "The relationship between libc and the kernel usually runs the direction described above — libc wraps a syscall the kernel has offered for years — but new kernel features are added faster than every libc adopts a matching convenience wrapper, and io_uring is a clear recent example: the kernel interface arrived, and for some time the practical way to use it from an application was a dedicated userspace library, liburing, built specifically to fill the gap before wrapper support caught up more broadly. In the interim, and in general whenever a program needs a syscall its libc has not wrapped yet, C code can fall back to calling syscall() directly with the raw number and the raw arguments, deliberately stepping around the convenience layer this whole cluster of articles has been describing.",
          "That escape hatch existing at all says something about the layering: the wrapper is a convenience the kernel does not require and libc does not gatekeep completely, which is exactly why it is possible for application code, in the rare cases it needs to, to reach past a library that has not caught up yet without waiting for a new release to add support.",
        ],
      },
      {
        h: 'NSS as its own abstraction layer, one level up from the syscalls that back it',
        p: [
          "It is worth separating two things that are easy to conflate: NSS is not a syscall interface at all, it is glibc's own abstraction over several information sources — DNS lookups, which do involve real network syscalls, but also flat files like /etc/passwd and /etc/hosts, which involve ordinary file syscalls, and in some configurations directory services that involve neither. A single call to a function like getpwnam() can, depending entirely on the local NSS configuration in /etc/nsswitch.conf, resolve through any combination of these sources without the calling code changing at all.",
          "This is a second abstraction layer sitting on top of the syscall layer already discussed, built for exactly the same reason: application code that wants to look up a username or a hostname should not need to know, or care, whether the answer today comes from a local file, a directory service, or a DNS query over the network — and that is precisely the property that made Go's own bypass of it, described above, into something worth documenting rather than a minor implementation detail.",
        ],
      },
      {
        h: 'When code skips the wrapper on purpose, for size',
        p: [
"A small but real category of software opts out of the ordinary libc wrapper deliberately, not for portability reasons but for size: statically linked micro-binaries, some embedded Rust targets built against no_std, and musl's own minimal nolibc-style paths all trade away parts of what a full libc provides \u2014 locale handling, the NSS-based name resolution discussed earlier, a broad and forgiving standard library surface \u2014 in exchange for a binary that is dramatically smaller and has fewer moving parts to audit or ship.",
"The trade is honest rather than free: code built this way is taking on, by hand, some of the responsibility the wrapper layer normally carries \u2014 getting the right syscall numbers for its target, handling errno's conventions correctly, doing without conveniences like buffered stdio \u2014 in exchange for control over exactly what ends up in the final binary. It is the right trade for a narrow embedded target and the wrong one for most application code, which is precisely why it stays a minority technique rather than a replacement for the ordinary wrapper.",
"Linux briefly offered an even faster path than the vDSO for a narrow set of calls, called vsyscall, mapping a fixed page of kernel code at a fixed address for a handful of very hot calls including an early version of time-of-day lookups. It was tightened and effectively superseded by the vDSO's approach specifically because a fixed, predictable address was a security liability \u2014 a known, unchanging location in every process's memory is exactly the kind of target that makes exploitation easier \u2014 which is itself a small case study in performance and security pulling in different directions at this same boundary.",
        ],
      },
    ],
  },
  {
    slug: 'syscall-abstraction-for-better-software',
    title: 'Testing Code That Makes System Calls',
    excerpt:
      'Real filesystem and network calls make tests slow, order-dependent and occasionally flaky for reasons that have nothing to do with the code under test. Abstracting the syscall boundary is what makes a test suite fast without making it a lie.',
    sections: [
      {
        h: 'Why tests that touch the real filesystem are slow and flaky',
        p: [
          "A test that opens a real file, writes to a real socket, or waits on a real clock is at the mercy of everything the operating system is doing for every other process on the machine at that moment — disk contention, network jitter, another test in the same suite that forgot to clean up its own temp directory. None of that variability has anything to do with whether the code under test is correct, and yet it is exactly what makes such tests slow on a good day and flaky on a bad one, failing intermittently for reasons a re-run usually — but not always — makes disappear.",
          "The flakiness is corrosive specifically because it erodes trust in the wrong direction: a test suite that occasionally fails for reasons unrelated to the code teaches the team to re-run failures rather than investigate them, and a re-run that happens to pass hides a genuine race the first run correctly caught.",
        ],
      },
      {
        h: 'Abstracting the syscall boundary for testability',
        p: [
          "The fix that scales is to put an interface between application code and the operating system at exactly the syscall boundary this whole cluster of articles is about — a filesystem interface, a clock interface, a network dialer interface — implemented for real against the actual syscalls in production, and implemented as an in-memory fake for tests. Code that depends on the interface rather than calling os.Open or its equivalent directly can run its entire test suite against the fake, with no real file ever touched and no real clock ever waited on, which is what makes such a suite both fast and deterministic.",
          "This is a direct, practical payoff of syscall abstraction rather than an abstract virtue: the same boundary that exists to hide platform differences from application code is also the natural seam to substitute a test double at, because both problems are really the same problem — application code should not need to know or care what is on the other side of that boundary, whether that is Linux, Windows, or a fake that lives entirely in memory.",
        ],
      },
      {
        h: 'Fakes, stubs and the danger of a fake that lies',
        p: [
          "A fake filesystem that always returns exactly the bytes requested, never returns a partial read, and never fails with a permission error is easy to write and dangerous to rely on, because it quietly asserts that none of the edge cases covered elsewhere in this expansion — partial reads, EINTR, descriptor limits — can ever happen. Code tested only against such a fake can look completely correct and still be missing the retry loop a real filesystem, under real load, will eventually require.",
          'The stronger version of a fake deliberately reproduces the awkward parts of the real interface — configurable to return a partial read on request, to simulate an interrupted call, to fail with a permission error on a specific path — precisely so that the error-handling paths get exercised in a fast, deterministic test rather than only ever being reached, for the first time, in production.',
        ],
      },
      {
        h: 'Sandboxes and containers as the other kind of isolation',
        p: [
          "Not every test can or should be replaced by a fake — an integration test that verifies a program truly reads and writes files correctly, or truly opens the sockets it claims to, needs to make the real syscalls at some point in the pipeline. The isolation that keeps such tests from fighting each other is different from a fake: run each test, or each parallel batch of tests, inside its own container or namespace with its own filesystem view and its own temp directory, so real syscalls are made against real but disposable state rather than a shared one that one test's mess can corrupt for the next.",
          "The two approaches are not competing so much as complementary, and most healthy test suites use both: fakes for the bulk of unit tests, where speed and determinism matter more than end-to-end realism, and a smaller number of sandboxed integration tests that exist specifically to catch the case where the fake and the real syscall have quietly drifted apart.",
        ],
      },
      {
        h: 'A temp directory is not automatically an isolated one',
        p: [
          "A common half-measure is to give every test its own temporary directory and assume that is enough isolation, without noticing that the syscall-level guarantees a test actually depends on go further than \"a different path\": file descriptor limits are shared across the whole process regardless of how many separate temp directories exist within it, and a test that leaks descriptors into a per-test directory still contributes to the same ceiling described earlier in this cluster of articles. Clock-dependent code has the same gap — a unique temp directory does nothing about a test that calls the real system clock and gets a slightly different answer depending on when in the run it happens to execute.",
          "The dependable version of isolation goes one level further than a unique path: inject the filesystem, the clock and the network dependency as interfaces, as described above, and reserve real per-test directories for the smaller set of tests that are deliberately exercising real syscalls end to end — at which point a fresh directory is providing genuine isolation rather than a false sense of it.",
        ],
      },
      {
        h: 'What CI environments quietly change about syscall behaviour',
        p: [
          "Continuous integration runners frequently execute tests inside containers, and containers change certain syscall-adjacent behaviour in ways that only surface once a test suite runs somewhere other than a developer's own machine: file descriptor limits are commonly lower by default inside a container than on a full workstation, available CPU count as reported to the process can be capped well below the host's real core count, and the filesystem backing a container's writable layer sometimes behaves differently under heavy small-file churn than a developer's local disk does.",
          'None of this is a flaw in containers; it is the same lesson as everywhere else in this cluster stated from a different angle — code that quietly assumed the syscall layer would always behave the way it did on one machine finds out otherwise the moment it runs somewhere with different real limits, and a CI environment is one of the more common places that discovery happens for the first time.',
        ],
      },
      {
        h: 'Recording real syscall behaviour once, replaying it forever',
        p: [
"Between a fully synthetic fake and a fully real integration test sits a third technique worth knowing: record the real responses a dependency gives once, under controlled conditions, and replay those exact recorded responses in every subsequent test run rather than either reimplementing the behaviour by hand or hitting the real thing every time. The same idea is well established for HTTP interactions under names like cassette or fixture recording, and it applies just as well one level lower, at the syscall boundary itself, for filesystem and process interactions that are awkward to fake convincingly by hand.",
"The advantage over a hand-written fake is fidelity without the ongoing cost of hitting a real system: the recorded response genuinely came from the real dependency at some point, including whatever awkward edge case was captured, and replaying it is as fast and deterministic as any other fake. The trade-off is that a recording can go stale if the real dependency's behaviour changes and nobody re-records it \u2014 which is why teams that rely on this technique treat their recordings as fixtures that need occasional, deliberate refreshing rather than artifacts that, once captured, can be trusted forever.",
"The discipline this technique rewards is the same one snapshot and golden-file testing rewards elsewhere in software: the recording is a committed artifact, reviewed like any other change when it is updated, rather than a black box nobody looks at again once it starts passing. Treated that way, it becomes a genuine record of what the real dependency did at a specific point in time, which is worth having even outside of testing, as documentation of behaviour a manual page might not spell out in full.",
        ],
      },
      {
        h: 'A short checklist for the syscall boundary specifically',
        p: [
"Distilled to a checklist: identify every place code crosses the syscall boundary \u2014 file access, network calls, the clock, process spawning; put an interface in front of each one rather than calling the platform function directly; provide a fast, deterministic fake for ordinary unit tests and reserve real, sandboxed integration tests for the smaller number of cases that specifically need to prove the real syscall behaves as expected. None of the three steps is exotic on its own, and together they are most of what separates a test suite that is trusted from one that is merely tolerated.",
        ],
      },
    ],
  },
  {
    slug: 'syscall-abstraction-for-simplified-system-interactions',
    title: 'Syscall Abstraction Across Operating Systems: POSIX, Win32 and the Portability Tax',
    excerpt:
      'POSIX and the Windows NT native API are not two dialects of the same idea. They are genuinely different models of what an operating system offers a program, and the abstraction layers that hide the difference are doing more work than most portable code gives them credit for.',
    sections: [
      {
        h: 'Two different worlds, not two dialects',
        p: [
          "POSIX systems — Linux, the BSDs, macOS underneath — share a family of syscalls built around a small set of ideas: everything is, as far as possible, a file descriptor; processes are created by fork(), which duplicates the calling process and lets the child go its own way; signals are the mechanism for asynchronous notification. Windows was built on a genuinely different native API, the NT kernel's own set of calls — NtCreateFile and its many relatives — which the Win32 API most Windows programs actually target sits on top of as its own abstraction layer, and which has no real equivalent of fork() at all; creating a new process on Windows is a fundamentally different operation, not a stylistic variant of the same one.",
          'The difference is not cosmetic. Code that assumes fork() semantics — a parent that can keep running exactly where it was, with a child that is a near-exact copy — has no direct translation on Windows, which is why portable process-management code usually reaches for a higher-level spawn abstraction rather than trying to express fork-and-exec in terms Windows can execute literally.',
        ],
      },
      {
        h: 'Runtimes as the abstraction layer that actually bridges this',
        p: [
          'Almost no application programmer writes directly against either POSIX syscalls or the NT native API; a language runtime sits in between and is the thing actually doing the bridging. libuv, underneath Node.js, maps its asynchronous I/O model onto epoll or kqueue on POSIX systems and onto I/O Completion Ports on Windows — two mechanisms that do not share an ABI, a calling convention, or even the same conceptual shape, unified behind one JavaScript-facing event loop. The JVM and the Go runtime do the analogous work for their own languages, each maintaining, in effect, two separate low-level implementations behind one portable interface.',
          "This is syscall abstraction at its most load-bearing: without it, \"write portable networked code\" would mean maintaining two entirely different implementations by hand, one per operating system family, for every piece of software that talks over a socket.",
        ],
      },
      {
        h: 'The compatibility layers that try to bridge the gap directly',
        p: [
          "Two well-known projects tried to close this gap from opposite directions. WSL1 translated Linux syscalls into NT native API calls on the fly, letting Linux binaries run unmodified on Windows without a Linux kernel present at all — an impressive piece of engineering that nonetheless could not cover every corner, because some Linux programs depend on kernel behaviour, particularly around certain ioctls and filesystem semantics, that does not have a clean NT equivalent to translate to. WSL2 abandoned that approach for a more robust one: it runs an actual Linux kernel inside a lightweight virtual machine, trading a small amount of overhead for syscall compatibility that is exact rather than approximated. Wine works the mirror-image problem, translating Win32 calls into the Linux syscalls and libraries needed to execute Windows binaries without Windows.",
          'Both projects are proof, by the sheer amount of effort required, of how deep the difference between the two syscall models actually goes — a translation layer this substantial would not need to exist if the two operating systems agreed on much beneath the surface.',
        ],
      },
      {
        h: 'Where the abstraction still shows through',
        p: [
          "Even with a runtime doing the heavy bridging, some differences surface in code that believes itself to be fully portable: path separators, case sensitivity of the filesystem, line-ending conventions, and the fact that Windows has no real equivalent of POSIX signals — software that catches SIGTERM to shut down cleanly on Linux needs a genuinely different mechanism on Windows, not a renamed version of the same one. None of this is a flaw in any particular abstraction layer; it is the residue of two systems that made different foundational choices, showing through wherever the abstraction has to stop somewhere short of erasing the difference entirely.",
          "Knowing where those seams are — rather than discovering them the first time a build only fails on one platform — is most of what \"writing portable code\" actually means in practice, since the abstraction layers handle everything else.",
        ],
      },
      {
        h: 'macOS: POSIX on paper, its own system underneath',
        p: [
          "macOS complicates a clean two-way POSIX-versus-Windows split, because it is certified POSIX-compliant at the API level while running on Darwin, a kernel with its own heritage and its own additions layered on top of the POSIX surface it exposes. kqueue, the BSD-family event-notification mechanism mentioned elsewhere in this cluster, originates in exactly this lineage rather than in Linux, and macOS carries its own security machinery — System Integrity Protection, sandboxing entitlements enforced by the kernel — that has no direct POSIX equivalent and has to be worked around, or worked with, by anything trying to be portable across all three major desktop platforms rather than just Linux and Windows.",
          "The practical upshot is that \"POSIX\" is necessary but not sufficient for genuine portability among Unix-like systems: code that only assumes the POSIX-guaranteed surface tends to work across Linux, the BSDs and macOS; code that quietly assumes Linux-specific behaviour beyond that surface — a particular /proc entry, a particular epoll edge case — is portable in name only, and finds that out the first time it runs somewhere that is POSIX-compliant without being Linux.",
        ],
      },
      {
        h: 'The smell of a platform check that should have been a feature check',
        p: [
          "A recurring code pattern worth naming directly is branching on the operating system's name — checking for \"posix\" or \"win32\" — to decide how to do something, when the actual requirement is narrower: does this specific mechanism exist here or not. The distinction matters because platform names are a proxy for feature availability, and proxies drift: a POSIX system missing one specific optional feature, or a future Windows release gaining a POSIX-like capability it did not have before, breaks a platform-name check while leaving a feature check correct by construction.",
          'Most mature runtimes expose the finer-grained check for exactly this reason — asking whether a given syscall or capability is available rather than asking which operating system is running — and code that asks the narrower question directly tends to age noticeably better than code that infers it indirectly from a platform name that was only ever a stand-in for the real question in the first place.',
        ],
      },
      {
        h: 'Text mode versus binary mode: a portability trap one layer up',
        p: [
"A specific, well-known instance of the seams discussed above sits in how a file is opened rather than in any syscall itself: the C runtime on Windows has historically distinguished text mode from binary mode when opening a file, and in text mode it silently translates between the platform's native line ending and the newline character C code expects, inserting or stripping carriage returns as data passes through. POSIX systems make no such distinction at this layer at all \u2014 a byte written is the byte read back, always \u2014 which means code that assumes \"text mode\" behaves identically everywhere can corrupt binary data on Windows, or, in the other direction, produce files whose line endings surprise a Windows-native editor when written from a POSIX system without the distinction being handled deliberately.",
"This is a translation performed by the C runtime layer, above the syscalls covered throughout this cluster of articles, not by the syscalls themselves \u2014 a reminder that the seams between platforms do not all live at the same layer, and that solving the syscall-level differences discussed elsewhere does not automatically solve this one.",
"A smaller, related seam sits in environment variables and search paths: POSIX systems separate entries in PATH with a colon, Windows with a semicolon, and code that builds or parses such a path by hand rather than through a platform-aware library function inherits this difference whether or not it was written with portability in mind. It is a minor detail next to the fork()-versus-native-process-creation gap discussed earlier, and it is exactly the kind of minor detail that only costs anything the first time code written on one platform is actually run on the other.",
        ],
      },
      {
        h: 'One list, not two, is the point',
        p: [
"Every seam catalogued across this article \u2014 process creation, path separators, signals, line endings, environment variable syntax \u2014 is small enough on its own to seem like a footnote, and the reason they are worth collecting into one list rather than leaving each as an isolated gotcha is that portable software tends to fail at exactly the intersection of several of them at once: a build script that spawns a subprocess, passes it a path, and waits on a signal to know when it finished touches three of these seams in three lines, and any one of the three being handled by a platform-aware library rather than by hand is usually enough to keep the whole script portable.",
        ],
      },
    ],
  },
  {
    slug: 'embracing-syscall-abstraction',
    title: 'Sandboxing and Syscall Filtering: seccomp, Pledge and Capability Security',
    excerpt:
      'Restricting which syscalls a process is allowed to make is one of the more effective security boundaries available on a modern system, precisely because every syscall is a door into something a compromised process would love to reach.',
    sections: [
      {
        h: 'Why filtering syscalls is a security boundary',
        p: [
          'Every capability a process has — reading arbitrary files, opening arbitrary sockets, spawning other processes, tracing other processes\' memory — is ultimately reached through a syscall, which means restricting which syscalls a process may make restricts what an attacker can do even after they have achieved arbitrary code execution inside it. This is a genuinely different kind of defence from validating input or patching a vulnerability: it assumes the process might already be compromised and asks what damage is still possible from there, rather than trying to prevent compromise in the first place.',
          'That framing — assume the worst has already happened, and limit the blast radius — is why syscall filtering has become a standard layer in container runtimes, browser sandboxes and anything else that runs code it does not fully trust.',
        ],
      },
      {
        h: 'seccomp-BPF on Linux',
        p: [
          "Linux's mechanism is seccomp, extended with BPF filters that let a process install a small program evaluated against every syscall it attempts — the syscall number and its arguments — which can allow, deny, or kill the process for any syscall that does not match the policy. Docker ships a default seccomp profile that blocks dozens of rarely-needed and higher-risk syscalls for every container unless a user explicitly opts out, and Chrome's renderer processes — the part of the browser that parses untrusted web content — run under a seccomp-BPF sandbox specifically because that is the code most likely to be handed something hostile.",
          'The BPF program runs inside the kernel at the moment of the syscall attempt, which is what makes the enforcement genuinely hard to bypass from inside the sandboxed process: there is no user-space check to trick, because the check is not in user space at all.',
        ],
      },
      {
        h: 'pledge() and unveil() on OpenBSD',
        p: [
          'OpenBSD took a different, coarser-grained approach with pledge(): rather than filtering individual syscalls with a BPF program, a process names broad categories of behaviour it promises to restrict itself to — "stdio" for basic I/O, "rpath" for read-only filesystem access, "inet" for networking, and so on — and the kernel enforces that any syscall outside the pledged categories is refused from that point forward. unveil() complements it by restricting which specific paths a process may see in the filesystem at all, rather than just what it may do with the ones it can reach.',
          'The trade-off against seccomp-BPF is legibility rather than raw expressiveness: a pledge() call is close to readable as a sentence, which makes it much easier for a maintainer to verify by eye that a program\'s declared restrictions actually match what it needs, at the cost of being unable to express the fine-grained per-argument rules a BPF filter can.',
        ],
      },
      {
        h: 'The trade-off: safety versus compatibility',
        p: [
          'Every syscall filtering policy makes a bet about which syscalls a program will need, and an over-restrictive bet does not fail loudly at build time — it fails at runtime, the first time an execution path reaches a syscall the policy did not anticipate, often deep inside a dependency the maintainer did not audit line by line. This is why sandbox policies in serious use are built from an observed syscall trace rather than guessed from documentation: run the real program under strace or an equivalent tracer, record every syscall it actually makes across its real workloads, and build the allowlist from that evidence rather than from intuition about what "should" be needed.',
          'That empirical approach is also why syscall filtering tends to be added late in a project\'s life rather than designed in from day one: it needs a mature enough program, exercised broadly enough, that the recorded trace can be trusted to represent everything legitimate use will ever require — otherwise the sandbox becomes a source of confusing, intermittent failures rather than the safety net it is meant to be.',
        ],
      },
      {
        h: 'Capsicum: restricting what a descriptor can reach, not which syscalls fire',
        p: [
          "FreeBSD's Capsicum takes a third, structurally different approach from both seccomp and pledge: rather than filtering syscall numbers or naming broad behavioural categories, it restricts what a process holding a particular file descriptor is allowed to do with it once that process has entered capability mode. Inside that mode, a process can no longer reach the global filesystem or process namespace by name at all \u2014 no opening an arbitrary path, no signalling an arbitrary process by its ID \u2014 and is limited to whatever specific descriptors it was handed before entering the restricted mode, plus whatever those descriptors can reach relative to themselves.",
          "This is a genuinely different security model rather than a stricter version of the same one: seccomp and pledge both still let a process operate against a global namespace as long as the syscalls or categories it uses are permitted, while Capsicum removes the global namespace from reach entirely and requires resources to be handed to a process explicitly, in advance, as descriptors \u2014 closer in spirit to how capability-based security systems are usually described in the academic literature than either of the other two mechanisms.",
        ],
      },
      {
        h: 'gVisor and user-space kernels: reimplementing the boundary instead of filtering it',
        p: [
          "A fourth approach sidesteps filtering the real kernel's syscalls altogether: gVisor, used as the sandbox underneath Google Cloud Run and parts of Google Kubernetes Engine, runs application code against a userspace program that itself implements the Linux syscall interface, intercepting every syscall the guest program makes and deciding, in its own code rather than the host kernel's, how or whether to service it \u2014 with only a narrow, deliberately small set of interactions actually reaching the real host kernel underneath.",
          "The trade-off is the mirror image of Capsicum's: instead of trusting the real kernel but restricting what an untrusted process may ask it to do, gVisor does not extend much trust to the real kernel's syscall surface being reachable by the guest at all, at the cost of reimplementing a meaningful portion of what a kernel does and the performance overhead that reimplementation carries. Both are legitimate answers to the same underlying question this section opened with \u2014 what should a compromised or fully untrusted process still not be able to do \u2014 arrived at from opposite directions.",
        ],
      },
      {
        h: 'How this reaches ordinary services without their own code changing',
        p: [
"None of the mechanisms above require an application to be rewritten to benefit from them, and systemd is the clearest example of why: a unit file can declare a SystemCallFilter= directive naming which syscalls a service may use, and systemd applies that restriction via seccomp when it starts the service, entirely outside the service's own source code. A long-running daemon that was never written with sandboxing in mind can be given a real, kernel-enforced syscall allowlist purely through its unit file configuration.",
"This is what makes syscall filtering practical at the scale of an entire operating system's worth of background services rather than a bespoke effort applied to a handful of especially sensitive programs: the policy lives in configuration the system administrator controls, built the same evidence-based way described above, and the service itself neither knows nor needs to know that it is running inside one.",
"Kubernetes offers the equivalent lever one layer further up the stack: a pod or container's securityContext can set a seccompProfile, applied by the container runtime when the pod starts, without the application inside needing to know the restriction exists any more than a systemd-managed service does. The specific mechanism differs by layer \u2014 systemd for a host-level service, Kubernetes for a scheduled container \u2014 but the shape is identical: syscall filtering declared as configuration, enforced by the platform, orthogonal to the application's own source code.",
        ],
      },
    ],
  },
  {
    slug: 'syscall-abstraction-simplifying-low-level-system-interactions',
    title: 'Async I/O and the Evolution of the Syscall Interface: select to io_uring',
    excerpt:
      'The syscall interface for handling many connections at once has been rebuilt from scratch three times, each time because the previous design stopped scaling — and the sequence explains why servers are built the way they are today.',
    sections: [
      {
        h: 'The blocking read/write problem',
        p: [
          'The most obvious way to write a server is one thread per connection, each thread blocking inside read() until its client sends something — simple to reason about, and it falls apart specifically at scale, because operating system threads are not free: each one carries its own stack and scheduling overhead, and a server trying to hold ten thousand mostly-idle connections open with ten thousand blocked threads spends much of its resources simply having those threads exist, doing nothing, waiting. This became known widely enough to get its own name, the C10K problem, once servers routinely needed to hold far more than ten thousand connections open at once.',
          'Everything described below is a different answer to the same underlying question: how does one process watch many file descriptors for activity without paying for a full blocked OS thread per descriptor?',
        ],
      },
      {
        h: 'select() and poll(): ask about everything, every time',
        p: [
          'The first widely portable answer was select() and later poll(): hand the kernel a list of every file descriptor you care about, and it returns which ones are ready. It works, and its cost scales with the size of the list you hand over on every single call — the kernel has to walk the whole set each time, whether one descriptor changed or a thousand, which means a server watching ten thousand connections pays a cost proportional to ten thousand on every iteration of its event loop regardless of how many of those connections actually did anything.',
          'That linear-in-the-watch-list cost, repeated on every call, is exactly what stopped scaling as the number of concurrent connections servers needed to handle kept growing through the following decade.',
        ],
      },
      {
        h: 'epoll and kqueue: the kernel tells you instead',
        p: [
          "Linux's epoll and the BSD family's kqueue inverted the relationship: register interest in a descriptor once, and the kernel maintains its own list of what has become ready, handing back only that list — not by rescanning every descriptor you registered — which is what makes retrieving ready descriptors closer to constant time relative to how many became ready, rather than linear in how many you are watching in total. That single change is most of why a modern server can hold hundreds of thousands of idle connections open without a proportional cost for each idle one.",
          "The two also introduced a real distinction worth understanding on its own: level-triggered notification says \"this descriptor has data waiting\" every time you ask, for as long as data remains, while edge-triggered notification says it exactly once, at the moment new data arrives, and expects the program to drain everything available before asking again — miss that requirement under edge-triggered mode and a connection can silently stop delivering events even though data is sitting there unread.",
        ],
      },
      {
        h: 'io_uring: removing the syscall from the hot path entirely',
        p: [
          "The most recent redesign, io_uring on Linux, goes past improving how readiness is reported and changes how the operations themselves are issued: user space and the kernel share ring buffers directly in memory, a program submits operations into one ring and later collects their results from another, and — with the right configuration — this can happen with dramatically fewer actual syscalls than the one-call-per-operation model every earlier interface still required, because a single syscall can flush many queued operations, or in some configurations the kernel can poll the ring itself with no syscall needed for a submission at all.",
          'The pattern across all three redesigns is consistent: each generation reduced how much a program pays, per unit of useful work, to cross the syscall boundary — first by making the kernel do the scanning instead of the caller, then by removing the caller\'s need to make a separate call per operation at all. Anyone building a high-throughput server or database today is choosing a point on that same continuum, whether they realise it or not.',
        ],
      },
      {
        h: 'Why Windows did not need the same three-step evolution',
        p: [
          "It is worth noting that Windows' equivalent facility, I/O Completion Ports, has existed since Windows NT and was already conceptually close to what io_uring eventually achieved on Linux decades later: a small number of threads pull completed operations off a shared queue rather than blocking one thread per operation or polling a watch list, which sidesteps the select()/poll() scaling problem from a different starting design rather than evolving through it the way the Linux stack did. This is one of the clearer illustrations, alongside the POSIX-versus-Win32 differences discussed elsewhere in this cluster, of two operating system families solving the same underlying problem on different timelines and by different routes, arriving at broadly comparable capability from genuinely different history.",
          "It also means that a portable async I/O library — libuv, in Node's case — has always had to bridge two facilities that reached similar goals from unrelated designs, which is part of why the internal implementation of such libraries looks so different on each platform even though the API they expose to application code stays the same.",
        ],
      },
      {
        h: 'Past C10K: kernel bypass and the C10M problem',
        p: [
          "Solving the C10K problem did not end the pressure to go further: modern network hardware and modern workloads pushed some systems toward the C10M problem — ten million concurrent connections — where even epoll's much cheaper per-event cost becomes a bottleneck at the packet-processing rates involved. The most aggressive answers bypass the kernel's networking stack for the packets that matter most: frameworks like DPDK hand a network card's packets directly to a userspace program, skipping the kernel syscall path for that traffic entirely, while XDP takes a different route by running a restricted, verified program inside the kernel at the earliest possible point a packet is seen, before it has travelled far enough up the stack to need most of the ordinary socket machinery at all.",
          'These are specialised tools for a specialised tier of workload — most software will never need them — and they are included here because they are the logical continuation of the exact trend this article has been tracing: every generation of this interface has existed to reduce how often, and how expensively, a program has to cross the boundary between itself and the kernel, and kernel bypass is simply the point on that continuum where the answer becomes "as rarely as possible, for this traffic, at all."',
        ],
      },
      {
        h: 'Why the newest interface is also the most cautiously adopted',
        p: [
"io_uring's power comes from a large, flexible surface close to the kernel, and that same surface has made it a security concern in its own right: several real vulnerabilities have been found specifically in its implementation, and a number of security-conscious environments \u2014 some container runtimes' default seccomp profiles among them \u2014 have restricted or disabled it rather than exposing its full surface to untrusted or semi-trusted workloads by default.",
"This is not a mark against the design so much as a reminder of a trade-off that recurs throughout this cluster: an interface built to remove cost from the syscall boundary does so by giving a program a more direct, more powerful relationship with the kernel, and a more powerful relationship is also a larger attack surface should that program ever be compromised. Adopting io_uring for its real performance benefits and restricting it in contexts where the calling code is not fully trusted are both reasonable positions, often held by the same organisation for different workloads.",
"None of this is unique to Linux in principle, even though the concrete implementation described throughout this article is: the general direction \u2014 batch more operations per crossing, let user space and the kernel share memory rather than copying through syscall arguments on every call \u2014 is a trend other operating systems have been exploring in their own idioms too, for the same underlying reason every step in this article's history has shared: crossing the boundary less often, and more cheaply per crossing, keeps paying off as workloads and connection counts keep growing.",
        ],
      },
    ],
  },
  {
    slug: 'syscall-abstraction-simplifying-low-level-system-interactions-6ki9',
    title: 'Language Runtimes and Syscalls: How Go, Node, the JVM and Python Hide the Boundary From You',
    excerpt:
      'Four popular runtimes take four different approaches to the same problem — making blocking syscalls invisible to concurrent code — and none of them hides the boundary completely.',
    sections: [
      {
        h: 'Go: parking a goroutine instead of blocking a thread',
        p: [
          "Go's runtime intercepts the syscalls its own standard library makes and, for the network operations that matter most for concurrency, uses the same underlying mechanism the previous article's epoll/kqueue discussion covers — a netpoller — so that a goroutine blocked waiting on a socket does not have to tie up an entire OS thread while it waits. The scheduler is free to run other goroutines on that thread in the meantime, which is most of why a Go program can comfortably run tens of thousands of concurrent goroutines on a handful of real OS threads: the expensive resource, an OS thread, is decoupled from the cheap one, a goroutine.",
          "Genuinely blocking syscalls that the netpoller cannot intercept this way — certain file operations, historically — are handled differently: the runtime detects that a thread is about to block and, in effect, lets another OS thread take over scheduling duties so the rest of the program keeps running, at the cost of that one syscall still occupying a real thread underneath for its actual duration.",
        ],
      },
      {
        h: 'Node.js: libuv\'s thread pool for the syscalls JavaScript can\'t do async',
        p: [
          'Node.js reuses the same event-loop idea for network I/O, riding directly on epoll, kqueue or I/O Completion Ports depending on platform, all of it invisible from JavaScript. Filesystem operations are a different story: on most operating systems there is no equivalent asynchronous mechanism for ordinary file reads and writes that is as complete as what sockets get, so libuv instead runs those calls on a small pool of worker threads behind the scenes and posts the result back to the single-threaded event loop when the blocking call finishes.',
          "That thread pool has a default size, and it is finite — a burst of filesystem-heavy work, or certain DNS lookups that also route through it, can exhaust the pool and start queuing, which shows up to an application as requests mysteriously slowing down under load with no obvious CPU bottleneck anywhere. UV_THREADPOOL_SIZE exists as a tuning knob precisely because this limit is real and does eventually get hit by fs-heavy or DNS-heavy Node services.",
        ],
      },
      {
        h: 'The JVM: native methods and the cost of crossing twice',
        p: [
          "Java's I/O eventually has to reach the same syscalls everything else does, and it gets there through the Java Native Interface — a mechanism for calling into native, typically C, code from managed Java code — which then makes the actual system call on Java's behalf. That JNI transition is its own boundary crossing, with its own overhead layered on top of whatever the syscall itself costs, and it is a meaningful part of why Java's NIO APIs, built around channels and buffers designed to minimise how often that crossing happens per unit of data moved, exist as a deliberate alternative to the older, simpler stream-based I/O classes.",
          "The JVM's garbage collector adds a further wrinkle specific to this runtime: a thread blocked in a native call has left the managed heap's view of the world temporarily, and the JVM has bookkeeping to do to make sure a garbage-collection pause can still proceed safely with threads sitting in that state — invisible to application code, but a real part of why the interaction between blocking I/O and GC pauses is a recurring tuning topic for Java services under load.",
        ],
      },
      {
        h: 'Python: why the GIL lets go for exactly this one thing',
        p: [
          "CPython's Global Interpreter Lock is usually discussed as the reason Python threads do not speed up CPU-bound work — only one thread executes Python bytecode at a time, no matter how many are running. What that framing tends to leave out is the specific, deliberate exception: CPython releases the GIL around blocking syscalls, precisely because a thread sitting inside a system call is not executing Python bytecode at all and holding the lock during that wait would serve no purpose except blocking every other thread in the process from doing anything at the same time.",
          "This is exactly why threads genuinely help I/O-bound Python programs — many threads each blocked in their own network read release the GIL for the duration of that wait, letting other threads run Python code in the meantime — while the same threads do essentially nothing for a CPU-bound workload, where there is no syscall to release the GIL around and the lock simply serialises everything regardless of how many threads exist. Recognising which category a given piece of code falls into, syscall-bound or CPU-bound, is most of what deciding whether threading will actually help a Python program comes down to.",
        ],
      },
      {
        h: 'What leaks through anyway',
        p: [
          "None of the three fully erases the syscall boundary; each hides it in the specific places its design targeted and lets it show through elsewhere. Go's netpoller covers network I/O comprehensively but genuinely blocking calls still occupy a real thread underneath. Node's event loop covers network I/O the same way but funnels filesystem and certain DNS work through a thread pool with a real, finite size. The JVM's native-call boundary is crossed twice for I/O that in a systems language would cross it once, which is exactly the overhead NIO exists to reduce.",
          'The common thread across all three runtimes, and the reason it is worth understanding regardless of which one a given piece of software is built on, is that "asynchronous" and "no syscall involved" are not the same claim. Every one of these designs is managing the same underlying syscall boundary described throughout this cluster of articles; they simply manage it in different places, and the place a given runtime did not optimise for is where its own version of this cost still surfaces under load.',
        ],
      },
      {
        h: 'Rust: the same boundary, made explicit rather than hidden',
        p: [
"Rust's standard library wraps syscalls in much the same spirit as C's does \u2014 through libc on most platforms, or through direct raw syscalls on some targets \u2014 and its dominant async ecosystem, built around runtimes like Tokio, implements its own reactor over epoll, kqueue or I/O Completion Ports, conceptually parallel to what libuv does for Node and what the netpoller does for Go rather than a fundamentally different design.",
"What differs is emphasis rather than mechanism: Rust's type system tends to make the boundary between blocking and non-blocking code, and between which functions may or may not make a blocking call, an explicit property checked at compile time rather than a convention enforced by discipline or documentation alone. The underlying syscalls, and the cost of crossing into them, are exactly the same ones this entire cluster of articles has been describing; what Rust adds is a compiler that is more willing to stop a program from crossing that boundary somewhere its author did not intend to.",
"This also shows up in how each language's async syntax is usually explained versus what it actually is: async/await, goroutines, and JavaScript's Promise-based APIs all read as though they introduce some new way of doing concurrency, when structurally each is sugar over the same reactor-and-callback shape described throughout this article, applied to whichever event-notification mechanism \u2014 epoll, kqueue, IOCP \u2014 the host platform actually offers underneath. The syntax differs by language; the syscalls being managed underneath it are the same ones this entire cluster of articles has been describing from the start.",
        ],
      },
      {
        h: '.NET: the fourth mainstream runtime that took the same route',
        p: [
"The .NET runtime's async/await, underneath the syntax, is built on the same shape described throughout this article: I/O completion is delivered through the operating system's native asynchronous facility \u2014 I/O Completion Ports on Windows, epoll on Linux \u2014 and a relatively small pool of threads processes completions as they arrive rather than one thread sitting blocked per pending operation. It is worth naming as a fourth data point precisely because it reinforces rather than complicates the pattern: every mainstream managed runtime that needs to handle many concurrent I/O operations cheaply has converged on some version of the same idea, differing in syntax and internal plumbing but not in the underlying strategy.",
        ],
      },
    ],
  },
];

/**
 * Apply every expansion to the assembled library, in place.
 *
 * Looked up by slug rather than by array position, because expansions are
 * written once and the library keeps changing shape around them (new batches,
 * new bot output). A slug that no longer exists — a rename, a removal — is
 * skipped rather than thrown on, so one missing entry cannot take the whole
 * build down.
 */
export function applyExpansions(all: Article[]): void {
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  for (const ex of EXPANSIONS) {
    const article = bySlug.get(ex.slug);
    if (!article) continue;
    if (ex.title) article.title = ex.title;
    if (ex.excerpt) article.excerpt = ex.excerpt;
    article.sections.push(...ex.sections);
  }
}
