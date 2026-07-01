// Central catalog taxonomy, sourced from the AXTO.dev brand/pricing
// reference sheets. Seed data (prisma/seed.ts) and the landing page both
// read from this file so the two stay in sync.

export const SITE = {
  name: "AXTO.dev",
  tagline: "Knowledge. Transform. Opportunity.",
  description:
    "AXTO adalah jembatan menuju ilmu, inspirasi, dan peluang tanpa batas — a premium marketplace for original and properly licensed digital e-books.",
  acronym: [
    { letter: "A", word: "Access to Knowledge" },
    { letter: "X", word: "eXplore Limitless Ideas" },
    { letter: "T", word: "Transform Your Life" },
    { letter: "O", word: "Open Opportunities" },
  ],
} as const;

export type PriceTierKey =
  | "TIER_1_BASICS"
  | "TIER_2_SKILL"
  | "TIER_3_GROWTH"
  | "TIER_4_BUSINESS"
  | "TIER_5_PREMIUM"
  | "TIER_6_SUPER_PREMIUM";

export interface PriceTierDef {
  key: PriceTierKey;
  label: string;
  categoryName: string;
  minCents: number;
  maxCents: number | null;
  icon: "leaf" | "target" | "brain" | "trending-up" | "book-open" | "gem";
  badge: string;
  sampleTitles: string[];
}

export const PRICE_TIERS: PriceTierDef[] = [
  {
    key: "TIER_1_BASICS",
    label: "Termurah",
    categoryName: "Belajar Dasar",
    minCents: 100,
    maxCents: 500,
    icon: "leaf",
    badge: "Pemula • Ringan • Praktis",
    sampleTitles: [
      "Belajar Bahasa Asing Dasar",
      "Matematika Dasar",
      "Membaca Cepat",
      "Grammar Bahasa Inggris",
      "Dasar Komputer",
    ],
  },
  {
    key: "TIER_2_SKILL",
    label: "Murah",
    categoryName: "Kursus & Skill",
    minCents: 500,
    maxCents: 1500,
    icon: "target",
    badge: "Praktis • Langsung Pakai",
    sampleTitles: [
      "Microsoft Office",
      "Desain Grafis (Canva)",
      "Editing Foto & Video",
      "Menulis Konten",
      "Public Speaking",
    ],
  },
  {
    key: "TIER_3_GROWTH",
    label: "Menengah",
    categoryName: "Pengembangan Diri",
    minCents: 1500,
    maxCents: 3000,
    icon: "brain",
    badge: "Upgrade Diri • Fokus",
    sampleTitles: [
      "Manajemen Waktu",
      "Mindset & Pola Pikir",
      "Produktivitas Tinggi",
      "Mengatasi Overthinking",
      "Disiplin & Konsistensi",
    ],
  },
  {
    key: "TIER_4_BUSINESS",
    label: "Mahal",
    categoryName: "Bisnis & Keuangan",
    minCents: 3000,
    maxCents: 7000,
    icon: "trending-up",
    badge: "Hasil • Menghasilkan",
    sampleTitles: [
      "Memulai Bisnis Online",
      "Digital Marketing",
      "Copywriting",
      "Financial Freedom",
      "Investasi untuk Pemula",
    ],
  },
  {
    key: "TIER_5_PREMIUM",
    label: "Premium",
    categoryName: "Kisah & Inspirasi",
    minCents: 7000,
    maxCents: 15000,
    icon: "book-open",
    badge: "Menginspirasi • Menyentuh",
    sampleTitles: [
      "Kumpulan Cerita Inspiratif",
      "Kisah Nyata & Perjalanan Hidup",
      "Biografi Tokoh Dunia (Original)",
      "Novel Ringan (Original)",
      "Cerita Motivasi",
    ],
  },
  {
    key: "TIER_6_SUPER_PREMIUM",
    label: "Super Premium",
    categoryName: "Expert & Mastery",
    minCents: 15000,
    maxCents: null,
    icon: "gem",
    badge: "Eksklusif • Transformasional",
    sampleTitles: [
      "Strategi Bisnis Lanjutan",
      "Branding Personal",
      "Automasi & AI",
      "E-commerce Mastery",
      "Mentorship & Coaching",
    ],
  },
];

export interface CategoryGroupDef {
  slug: string;
  name: string;
  minCents: number;
  maxCents: number;
  sampleTitles: string[];
}

// "Tambahan Kategori Populer" — additional popular categories layered on
// top of the six price tiers above.
export const POPULAR_CATEGORIES: CategoryGroupDef[] = [
  {
    slug: "kesehatan-kebugaran",
    name: "Kesehatan & Kebugaran",
    minCents: 500,
    maxCents: 2500,
    sampleTitles: ["Pola Hidup Sehat", "Diet & Nutrisi", "Olahraga di Rumah", "Kesehatan Mental"],
  },
  {
    slug: "hobi-kreativitas",
    name: "Hobi & Kreativitas",
    minCents: 500,
    maxCents: 2500,
    sampleTitles: ["Melukis untuk Pemula", "Fotografi Dasar", "Craft & DIY", "Musik & Instrumen"],
  },
  {
    slug: "religi-spiritual",
    name: "Religi & Spiritual",
    minCents: 500,
    maxCents: 3000,
    sampleTitles: [
      "Pengembangan Diri Islami",
      "Kajian & Motivasi Islami",
      "Doa & Dzikir Harian",
      "Tadabbur Al-Qur'an",
    ],
  },
  {
    slug: "parenting-family",
    name: "Parenting & Family",
    minCents: 1000,
    maxCents: 4000,
    sampleTitles: ["Parenting Positif", "Mendidik Anak Cerdas", "Komunikasi Keluarga", "Balita & Remaja"],
  },
  {
    slug: "karier-pekerjaan",
    name: "Karier & Pekerjaan",
    minCents: 1000,
    maxCents: 4000,
    sampleTitles: ["CV & Cover Letter", "Interview & Soft Skill", "Freelance untuk Pemula", "Naik Jabatan & Karier"],
  },
  {
    slug: "teknologi-ai",
    name: "Teknologi & AI",
    minCents: 1500,
    maxCents: 5000,
    sampleTitles: ["AI untuk Pemula", "ChatGPT untuk Produktivitas", "Coding Dasar", "Cybersecurity Dasar"],
  },
];

// Broader master taxonomy the catalog can grow into (spec §PRODUCT
// CATEGORIES). Not all of these have seed books yet, but categories can be
// created for any of them from the admin panel without a schema change.
export const FUTURE_CATEGORY_POOL = [
  "Learning", "Programming", "Artificial Intelligence", "Business", "Finance", "Marketing",
  "Sales", "Productivity", "Career", "Education", "Languages", "Self Improvement", "Psychology",
  "Leadership", "Communication", "Public Speaking", "Writing", "Design", "Photography",
  "Video Editing", "Music", "Health", "Fitness", "Nutrition", "Cooking", "Parenting",
  "Relationships", "Travel", "History", "Science", "Technology", "Religion", "Culture",
  "Biography", "Memoir", "Inspirational Stories", "Children", "Teen", "Academic", "Templates",
  "Workbooks", "Checklists", "Guides", "Reference", "Case Studies",
] as const;

export interface LanguageDef {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageDef[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "en-CA", name: "Canadian English", nativeName: "Canadian English" },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
];

export const MAX_LANGUAGE_DOWNLOADS_PER_BOOK = 2;

export type CryptoAsset = "BTC" | "ETH" | "BNB" | "SOL" | "USDT_TRC20" | "DOGE";

export interface CryptoAssetDef {
  asset: CryptoAsset;
  symbol: string;
  name: string;
  network: string;
  coingeckoId: string;
  envVar: string;
  confirmationsRequired: number;
}

export const CRYPTO_ASSETS: CryptoAssetDef[] = [
  { asset: "BTC", symbol: "BTC", name: "Bitcoin", network: "Bitcoin", coingeckoId: "bitcoin", envVar: "CRYPTO_ADDRESS_BTC", confirmationsRequired: 1 },
  { asset: "ETH", symbol: "ETH", name: "Ethereum", network: "Ethereum", coingeckoId: "ethereum", envVar: "CRYPTO_ADDRESS_ETH", confirmationsRequired: 50 },
  { asset: "BNB", symbol: "BNB", name: "BNB", network: "BNB Smart Chain (BEP20)", coingeckoId: "binancecoin", envVar: "CRYPTO_ADDRESS_BNB", confirmationsRequired: 12 },
  { asset: "SOL", symbol: "SOL", name: "Solana", network: "Solana", coingeckoId: "solana", envVar: "CRYPTO_ADDRESS_SOL", confirmationsRequired: 1 },
  { asset: "USDT_TRC20", symbol: "USDT", name: "Tether (TRC20)", network: "Tron (TRC20)", coingeckoId: "tether", envVar: "CRYPTO_ADDRESS_USDT_TRC20", confirmationsRequired: 20 },
  { asset: "DOGE", symbol: "DOGE", name: "Dogecoin", network: "Dogecoin", coingeckoId: "dogecoin", envVar: "CRYPTO_ADDRESS_DOGE", confirmationsRequired: 1 },
];

export const CRYPTO_QUOTE_TTL_SECONDS = 20 * 60;
