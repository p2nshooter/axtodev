/**
 * Seeds languages, the category taxonomy, one fully realized flagship
 * e-book (real content, all 8 site languages), and a DRAFT starter
 * catalog (title/TOC scaffolding only — intentionally never published,
 * since selling placeholder text as a finished e-book would misrepresent
 * the product to customers). Safe to re-run — every write is an upsert.
 *
 * Run with: pnpm db:seed
 */
import { PrismaClient } from "@prisma/client";
import { PRICE_TIERS, POPULAR_CATEGORIES, SUPPORTED_LANGUAGES } from "../src/lib/constants";
import { slugify } from "../src/lib/utils";
import { FLAGSHIP_BOOK_SLUG, FLAGSHIP_TRANSLATIONS } from "./content/flagship-book";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding languages…");
  const languageByCode = new Map<string, string>();
  for (const lang of SUPPORTED_LANGUAGES) {
    const row = await prisma.language.upsert({
      where: { code: lang.code },
      update: { name: lang.name, nativeName: lang.nativeName, rtl: lang.rtl ?? false },
      create: { code: lang.code, name: lang.name, nativeName: lang.nativeName, rtl: lang.rtl ?? false },
    });
    languageByCode.set(lang.code, row.id);
  }
  const enId = languageByCode.get("en")!;

  console.log("Seeding categories…");
  const categoryByName = new Map<string, string>();

  let sortOrder = 0;
  for (const tier of PRICE_TIERS) {
    const slug = slugify(tier.categoryName);
    const row = await prisma.category.upsert({
      where: { slug },
      update: { name: tier.categoryName, sortOrder, featured: true },
      create: { slug, name: tier.categoryName, sortOrder, featured: true },
    });
    categoryByName.set(tier.categoryName, row.id);
    sortOrder++;
  }

  for (const cat of POPULAR_CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder },
      create: { slug: cat.slug, name: cat.name, sortOrder },
    });
    categoryByName.set(cat.name, row.id);
    sortOrder++;
  }

  console.log("Seeding flagship e-book (real content, all 8 languages)…");
  const growthCategoryId = categoryByName.get("Pengembangan Diri")!;
  const flagshipExists = await prisma.book.findUnique({ where: { slug: FLAGSHIP_BOOK_SLUG } });
  if (!flagshipExists) {
    await prisma.book.create({
      data: {
        slug: FLAGSHIP_BOOK_SLUG,
        categoryId: growthCategoryId,
        priceTier: "TIER_3_GROWTH",
        priceCents: 1900,
        status: "PUBLISHED",
        licenseType: "ORIGINAL",
        author: "AXTO.dev Editorial Team",
        readingTimeMinutes: 35,
        difficultyLevel: "Beginner",
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        publishedAt: new Date(),
        translations: {
          create: FLAGSHIP_TRANSLATIONS.map((t) => ({
            languageId: languageByCode.get(t.languageCode)!,
            title: t.title,
            subtitle: t.subtitle,
            description: t.description,
            tableOfContents: JSON.stringify(t.tableOfContents),
            keywords: t.keywords,
          })),
        },
        statusHistory: { create: [{ status: "PUBLISHED", note: "Flagship launch title — real content, 8 languages" }] },
      },
    });
  }

  console.log("Seeding DRAFT starter catalog (scaffolding only — not for sale until real manuscripts are added)…");
  for (const tier of PRICE_TIERS) {
    const categoryId = categoryByName.get(tier.categoryName)!;
    for (const [i, title] of tier.sampleTitles.entries()) {
      const slug = `${slugify(title)}-${tier.key.toLowerCase()}`;
      if (slug === FLAGSHIP_BOOK_SLUG) continue;
      const priceCents = Math.round((tier.minCents + tier.maxCents!) / 2) || tier.minCents + 500;

      const existing = await prisma.book.findUnique({ where: { slug } });
      if (existing) continue;

      await prisma.book.create({
        data: {
          slug,
          categoryId,
          priceTier: tier.key,
          priceCents,
          status: "DRAFT", // never auto-published — see file header
          licenseType: "ORIGINAL",
          licenseSource: "STARTER CATALOG SCAFFOLD — title/TOC only, needs a real manuscript before publishing.",
          author: "AXTO.dev Editorial Team",
          readingTimeMinutes: 45 + i * 10,
          difficultyLevel: i % 2 === 0 ? "Beginner" : "Intermediate",
          translations: {
            create: [
              {
                languageId: enId,
                title,
                subtitle: `Planned AXTO.dev guide — ${tier.badge}`,
                description:
                  `Catalog placeholder for "${title}". This title is scaffolded (category, price tier, and a draft ` +
                  `table of contents) but has no manuscript yet, so it's kept in DRAFT and hidden from the storefront. ` +
                  `Write the real content in /admin/books, then publish.`,
                tableOfContents: JSON.stringify([
                  "Introduction & how to use this book",
                  "Foundations",
                  "Core techniques",
                  "Common mistakes to avoid",
                  "Putting it into practice",
                  "Next steps",
                ]),
                keywords: title.toLowerCase(),
              },
            ],
          },
          statusHistory: { create: [{ status: "DRAFT" }] },
        },
      });
    }
  }

  if (process.env.ADMIN_BOOTSTRAP_EMAIL) {
    const admin = await prisma.user.findUnique({ where: { email: process.env.ADMIN_BOOTSTRAP_EMAIL } });
    if (admin && admin.role === "CUSTOMER") {
      await prisma.user.update({ where: { id: admin.id }, data: { role: "SUPER_ADMIN" } });
      console.log(`Promoted ${admin.email} to SUPER_ADMIN.`);
    } else if (!admin) {
      console.log(
        `ADMIN_BOOTSTRAP_EMAIL (${process.env.ADMIN_BOOTSTRAP_EMAIL}) has no account yet — register normally, then re-run the seed to promote it to SUPER_ADMIN.`,
      );
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
