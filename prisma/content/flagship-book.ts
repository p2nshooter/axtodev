/**
 * One fully realized, original, multi-language flagship e-book — proof
 * that the catalog pipeline (translations, table of contents, language
 * entitlement, license metadata) works end-to-end with real content, not
 * placeholder text. Licensed as 100% original AXTO.dev editorial writing.
 *
 * Scaling this to a large catalog is a separate, deliberate effort (an
 * admin-side AI-assisted drafting tool with human review before
 * publishing, per docs/CONTENT_POLICY.md) — not something to fabricate at
 * seed time. See README "Content roadmap" for the honest scope of what a
 * single seed script can responsibly do.
 */

export interface FlagshipTranslation {
  languageCode: string;
  title: string;
  subtitle: string;
  description: string;
  tableOfContents: string[];
  keywords: string;
}

export const FLAGSHIP_BOOK_SLUG = "master-your-focus-deep-work-guide";

export const FLAGSHIP_TRANSLATIONS: FlagshipTranslation[] = [
  {
    languageCode: "en",
    title: "Master Your Focus",
    subtitle: "A practical guide to deep work in a distracted world",
    description:
      "Notifications, open tabs, and endless small requests have made sustained concentration rare — and rare things are valuable. " +
      "This guide is a compact, practical system for reclaiming your attention: not another productivity philosophy to admire, but six " +
      "short chapters you can put to use today.\n\nChapter 1 starts with why focus is now a competitive advantage rather than a personality " +
      "trait. Chapter 2 breaks down the real cost of context-switching and shows how a single interruption can cost twenty focused minutes " +
      "to recover from. Chapter 3 gives you a three-step ritual for entering deep work on demand — a fixed sequence your brain learns to " +
      "recognize as the start of focused time, the same way a runner's warm-up signals the body to prepare. Chapter 4 covers environment " +
      "design: the handful of physical and digital changes that remove friction before it happens, rather than relying on willpower once " +
      "you're already distracted. Chapter 5 addresses the hardest part — protecting focus time from other people — with scripts for saying " +
      "no without damaging relationships. Chapter 6 closes with a simple weekly review that compounds these habits instead of letting them " +
      "fade after a good first week.\n\nNothing here requires new software or a productivity system overhaul. It requires about ninety " +
      "minutes to read and one week to test.",
    tableOfContents: [
      "Why focus became a competitive advantage",
      "The real cost of context-switching",
      "A three-step ritual to enter deep work on demand",
      "Designing your environment before you need willpower",
      "Protecting your time without damaging relationships",
      "A weekly review that makes it stick",
    ],
    keywords: "deep work, focus, productivity, concentration, time management",
  },
  {
    languageCode: "en-CA",
    title: "Master Your Focus",
    subtitle: "A practical guide to deep work in a distracted world",
    description:
      "Notifications, open tabs, and endless small requests have made sustained concentration rare — and rare things are valuable. " +
      "This guide is a compact, practical system for reclaiming your attention: not another productivity philosophy to admire, but six " +
      "short chapters you can put to use today.\n\nChapter 1 starts with why focus is now a competitive advantage rather than a personality " +
      "trait. Chapter 2 breaks down the real cost of context-switching and shows how a single interruption can cost twenty focused minutes " +
      "to recover from. Chapter 3 gives you a three-step ritual for entering deep work on demand. Chapter 4 covers environment design: the " +
      "handful of physical and digital changes that remove friction before it happens. Chapter 5 addresses the hardest part — protecting " +
      "focus time from other people — with scripts for saying no without damaging relationships. Chapter 6 closes with a simple weekly " +
      "review that compounds these habits instead of letting them fade after a good first week.\n\nNothing here requires new software or a " +
      "productivity system overhaul. It requires about ninety minutes to read and one week to test.",
    tableOfContents: [
      "Why focus became a competitive advantage",
      "The real cost of context-switching",
      "A three-step ritual to enter deep work on demand",
      "Designing your environment before you need willpower",
      "Protecting your time without damaging relationships",
      "A weekly review that makes it stick",
    ],
    keywords: "deep work, focus, productivity, concentration, time management",
  },
  {
    languageCode: "id",
    title: "Kuasai Fokusmu",
    subtitle: "Panduan praktis bekerja mendalam di dunia yang penuh distraksi",
    description:
      "Notifikasi, tab yang menumpuk, dan permintaan kecil tanpa henti membuat konsentrasi penuh menjadi barang langka — dan yang langka " +
      "itu berharga. Panduan ini adalah sistem ringkas dan praktis untuk merebut kembali perhatianmu: bukan filosofi produktivitas lain " +
      "untuk dikagumi, tapi enam bab pendek yang bisa langsung dipakai hari ini.\n\nBab 1 menjelaskan mengapa fokus kini menjadi keunggulan " +
      "kompetitif, bukan sekadar sifat bawaan. Bab 2 membedah biaya nyata dari berpindah-pindah tugas — satu interupsi kecil bisa memakan " +
      "dua puluh menit waktu fokus untuk pulih. Bab 3 memberikan ritual tiga langkah untuk masuk ke kondisi kerja mendalam kapan pun " +
      "dibutuhkan. Bab 4 membahas desain lingkungan: sedikit perubahan fisik dan digital yang menghilangkan hambatan sebelum muncul, " +
      "bukan mengandalkan kemauan setelah gangguan sudah terjadi. Bab 5 membahas bagian tersulit — melindungi waktu fokus dari orang " +
      "lain — lengkap dengan contoh kalimat menolak tanpa merusak hubungan. Bab 6 ditutup dengan tinjauan mingguan sederhana agar " +
      "kebiasaan ini bertahan, bukan memudar setelah minggu pertama yang bagus.\n\nTidak perlu aplikasi baru atau sistem produktivitas " +
      "yang rumit. Cukup sekitar sembilan puluh menit untuk membaca dan satu minggu untuk mencobanya.",
    tableOfContents: [
      "Mengapa fokus menjadi keunggulan kompetitif",
      "Biaya nyata dari berpindah-pindah tugas",
      "Ritual tiga langkah menuju kerja mendalam",
      "Mendesain lingkungan sebelum butuh kemauan keras",
      "Melindungi waktu tanpa merusak hubungan",
      "Tinjauan mingguan agar kebiasaan bertahan",
    ],
    keywords: "fokus, produktivitas, kerja mendalam, manajemen waktu, konsentrasi",
  },
  {
    languageCode: "zh",
    title: "掌控你的专注力",
    subtitle: "在充满干扰的世界里进行深度工作的实用指南",
    description:
      "通知、层出不穷的浏览器标签和无尽的琐碎请求，让持续专注变得稀有——而稀有的东西才珍贵。本指南是一套简洁实用的系统，帮你重新掌控注意力：" +
      "不是又一套值得欣赏的生产力理论，而是六个可以今天就用上的短章节。\n\n第一章说明专注为何已成为一种竞争优势，而非天生性格。第二章拆解频繁" +
      "切换任务的真实代价——一次打断可能需要二十分钟才能恢复专注。第三章提供一套三步仪式，让你随时进入深度工作状态。第四章讲解环境设计：在" +
      "干扰发生之前，用少数几个物理和数字层面的改变提前清除障碍。第五章处理最难的部分——如何在不破坏关系的前提下保护专注时间。第六章以简单" +
      "的每周回顾收尾，让这些习惯持续巩固，而不是在美好的第一周之后就消退。\n\n无需新软件，也无需彻底改造你的生产力系统。只需大约九十分钟阅读，" +
      "一周时间实践。",
    tableOfContents: [
      "专注为何成为竞争优势",
      "任务切换的真实代价",
      "进入深度工作的三步仪式",
      "在需要意志力之前先设计环境",
      "在不破坏关系的前提下保护你的时间",
      "让习惯持续的每周回顾",
    ],
    keywords: "深度工作, 专注力, 生产力, 时间管理, 注意力",
  },
  {
    languageCode: "ja",
    title: "集中力を極める",
    subtitle: "気が散る世界で深い仕事をするための実践ガイド",
    description:
      "通知、開きっぱなしのタブ、絶え間ない小さな依頼——それらが持続的な集中を希少なものにしている。希少なものには価値がある。本書は注意力を" +
      "取り戻すための、コンパクトで実践的なシステムだ。眺めて満足するような生産性理論ではなく、今日から使える6つの短い章で構成されている。\n\n" +
      "第1章では、集中力がなぜ性格ではなく競争優位になったのかを説明する。第2章では、タスク切り替えの本当のコストを分解し、一度の中断が" +
      "20分もの集中時間を奪うことを示す。第3章では、いつでも深い仕事に入るための3ステップの儀式を紹介する。第4章では環境デザインを扱い、" +
      "意志力に頼る前に摩擦を取り除く物理的・デジタル的な工夫を紹介する。第5章では最も難しい部分——人間関係を損なわずに集中時間を守る方法" +
      "——を、断り方の具体例とともに扱う。第6章は、良いスタートを切った週の後に習慣が消えてしまわないよう、シンプルな週次レビューで締めくくる。" +
      "\n\n新しいソフトも大掛かりな生産性システムの刷新も不要。読むのに約90分、試すのに1週間あれば十分だ。",
    tableOfContents: [
      "集中力が競争優位になった理由",
      "タスク切り替えの本当のコスト",
      "深い仕事に入るための3ステップの儀式",
      "意志力に頼る前に環境をデザインする",
      "人間関係を損なわずに時間を守る",
      "習慣を定着させる週次レビュー",
    ],
    keywords: "深い仕事, 集中力, 生産性, 時間管理, 注意力",
  },
  {
    languageCode: "fr",
    title: "Maîtrisez votre concentration",
    subtitle: "Un guide pratique du travail en profondeur dans un monde de distractions",
    description:
      "Notifications, onglets ouverts et petites sollicitations incessantes ont rendu la concentration soutenue rare — et ce qui est " +
      "rare a de la valeur. Ce guide est un système compact et pratique pour reprendre le contrôle de votre attention : non pas une " +
      "énième philosophie de la productivité à admirer, mais six courts chapitres que vous pouvez appliquer dès aujourd'hui.\n\nLe " +
      "chapitre 1 explique pourquoi la concentration est devenue un avantage compétitif plutôt qu'un trait de caractère. Le chapitre 2 " +
      "décompose le coût réel du changement de contexte : une seule interruption peut coûter vingt minutes de concentration à " +
      "récupérer. Le chapitre 3 propose un rituel en trois étapes pour entrer en travail profond à volonté. Le chapitre 4 traite de " +
      "l'aménagement de l'environnement : quelques changements physiques et numériques qui suppriment les frictions avant qu'elles " +
      "n'apparaissent. Le chapitre 5 aborde la partie la plus difficile — protéger son temps de concentration face aux autres — avec " +
      "des formules pour refuser sans nuire aux relations. Le chapitre 6 se termine par une revue hebdomadaire simple qui consolide " +
      "ces habitudes au lieu de les laisser s'estomper après une bonne première semaine.\n\nRien ici ne nécessite un nouveau logiciel " +
      "ni une refonte complète de votre système de productivité. Il faut environ quatre-vingt-dix minutes pour le lire et une semaine " +
      "pour le tester.",
    tableOfContents: [
      "Pourquoi la concentration est devenue un avantage compétitif",
      "Le coût réel du changement de contexte",
      "Un rituel en trois étapes pour le travail profond",
      "Concevoir son environnement avant d'avoir besoin de volonté",
      "Protéger son temps sans nuire aux relations",
      "Une revue hebdomadaire qui ancre l'habitude",
    ],
    keywords: "travail profond, concentration, productivité, gestion du temps, attention",
  },
  {
    languageCode: "de",
    title: "Beherrsche deinen Fokus",
    subtitle: "Ein praktischer Leitfaden für konzentriertes Arbeiten in einer ablenkenden Welt",
    description:
      "Benachrichtigungen, offene Tabs und endlose kleine Anfragen haben anhaltende Konzentration selten gemacht — und Seltenes ist " +
      "wertvoll. Dieser Leitfaden ist ein kompaktes, praktisches System, um deine Aufmerksamkeit zurückzugewinnen: keine weitere " +
      "Produktivitätsphilosophie zum Bewundern, sondern sechs kurze Kapitel, die du noch heute anwenden kannst.\n\nKapitel 1 erklärt, " +
      "warum Fokus heute ein Wettbewerbsvorteil ist und kein Charakterzug. Kapitel 2 zeigt die wahren Kosten des ständigen " +
      "Aufgabenwechsels: Eine einzige Unterbrechung kann zwanzig Minuten konzentrierter Arbeit kosten, um sich davon zu erholen. " +
      "Kapitel 3 bietet ein Drei-Schritte-Ritual, um jederzeit in konzentriertes Arbeiten einzutauchen. Kapitel 4 behandelt die " +
      "Gestaltung der Umgebung: wenige physische und digitale Änderungen, die Reibung beseitigen, bevor sie entsteht. Kapitel 5 " +
      "widmet sich dem schwierigsten Teil — der Verteidigung der Fokuszeit gegenüber anderen Menschen — mit konkreten Formulierungen, " +
      "um abzulehnen, ohne Beziehungen zu belasten. Kapitel 6 schließt mit einem einfachen wöchentlichen Rückblick, der diese " +
      "Gewohnheiten festigt, statt sie nach einer guten ersten Woche wieder verblassen zu lassen.\n\nNichts davon erfordert neue " +
      "Software oder eine komplette Umstellung deines Produktivitätssystems. Es braucht etwa neunzig Minuten zum Lesen und eine " +
      "Woche zum Ausprobieren.",
    tableOfContents: [
      "Warum Fokus zum Wettbewerbsvorteil wurde",
      "Die wahren Kosten des Aufgabenwechsels",
      "Ein Drei-Schritte-Ritual für konzentriertes Arbeiten",
      "Die Umgebung gestalten, bevor Willenskraft nötig ist",
      "Die eigene Zeit schützen, ohne Beziehungen zu belasten",
      "Ein wöchentlicher Rückblick, der die Gewohnheit festigt",
    ],
    keywords: "konzentriertes arbeiten, fokus, produktivität, zeitmanagement, aufmerksamkeit",
  },
  {
    languageCode: "ar",
    title: "أتقن تركيزك",
    subtitle: "دليل عملي للعمل العميق في عالم مليء بالتشتيت",
    description:
      "جعلت الإشعارات وعلامات التبويب المفتوحة والطلبات الصغيرة التي لا تنتهي التركيزَ المستمر أمرًا نادرًا — والنادر ثمين. هذا الدليل " +
      "نظام عملي مختصر لاستعادة انتباهك: ليس فلسفة إنتاجية أخرى للإعجاب بها، بل ستة فصول قصيرة يمكنك تطبيقها اليوم.\n\nيبدأ الفصل " +
      "الأول بشرح لماذا أصبح التركيز ميزة تنافسية وليس سمة شخصية. يفصّل الفصل الثاني التكلفة الحقيقية لتبديل السياق، ويوضح كيف يمكن " +
      "لمقاطعة واحدة أن تكلفك عشرين دقيقة من التركيز لاستعادته. يقدم الفصل الثالث طقسًا من ثلاث خطوات للدخول في العمل العميق " +
      "عند الحاجة. يتناول الفصل الرابع تصميم البيئة: مجموعة صغيرة من التغييرات المادية والرقمية التي تزيل العوائق قبل حدوثها. " +
      "يعالج الفصل الخامس الجزء الأصعب — حماية وقت التركيز من الآخرين — مع عبارات جاهزة للرفض دون الإضرار بالعلاقات. ويختتم " +
      "الفصل السادس بمراجعة أسبوعية بسيطة تعزز هذه العادات بدلاً من تلاشيها بعد أسبوع أول جيد.\n\nلا شيء هنا يتطلب برنامجًا جديدًا " +
      "أو إعادة هيكلة كاملة لنظام إنتاجيتك. يحتاج الأمر إلى نحو تسعين دقيقة للقراءة وأسبوع واحد للتجربة.",
    tableOfContents: [
      "لماذا أصبح التركيز ميزة تنافسية",
      "التكلفة الحقيقية لتبديل السياق",
      "طقس من ثلاث خطوات للدخول في العمل العميق",
      "تصميم البيئة قبل الحاجة إلى قوة الإرادة",
      "حماية وقتك دون الإضرار بالعلاقات",
      "مراجعة أسبوعية تجعل العادة تدوم",
    ],
    keywords: "العمل العميق, التركيز, الإنتاجية, إدارة الوقت, الانتباه",
  },
];
