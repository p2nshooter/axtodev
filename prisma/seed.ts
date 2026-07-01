/**
 * Seeds languages, the category taxonomy, and a handful of sample
 * originally-written e-books so the storefront isn't empty in
 * development/staging. Safe to re-run — every write is an upsert.
 *
 * Run with: pnpm db:seed
 */
import { PrismaClient } from "@prisma/client";
import { PRICE_TIERS, POPULAR_CATEGORIES, SUPPORTED_LANGUAGES } from "../src/lib/constants";
import { slugify } from "../src/lib/utils";

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

  console.log("Seeding sample e-books…");
  for (const tier of PRICE_TIERS) {
    const categoryId = categoryByName.get(tier.categoryName)!;
    for (const [i, title] of tier.sampleTitles.entries()) {
      const slug = `${slugify(title)}-${tier.key.toLowerCase()}`;
      const priceCents = Math.round((tier.minCents + tier.maxCents!) / 2) || tier.minCents + 500;

      const existing = await prisma.book.findUnique({ where: { slug } });
      if (existing) continue;

      await prisma.book.create({
        data: {
          slug,
          categoryId,
          priceTier: tier.key,
          priceCents,
          status: "PUBLISHED",
          licenseType: "ORIGINAL",
          author: "AXTO.dev Editorial Team",
          readingTimeMinutes: 45 + i * 10,
          difficultyLevel: i % 2 === 0 ? "Beginner" : "Intermediate",
          isFeatured: i === 0,
          isBestSeller: i === 1,
          isNew: i >= 2,
          publishedAt: new Date(),
          translations: {
            create: [
              {
                languageId: enId,
                title,
                subtitle: `An original AXTO.dev guide — ${tier.badge}`,
                description:
                  `${title} is an original AXTO.dev publication written from scratch for learners who want a ` +
                  `clear, practical path forward. This is placeholder catalog copy generated for the initial ` +
                  `store setup — replace it with your real manuscript before going live.`,
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
          statusHistory: { create: [{ status: "PUBLISHED" }] },
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
