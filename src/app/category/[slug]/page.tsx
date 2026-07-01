import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/book/book-card";
import { getBooksByCategorySlug } from "@/server/book-service";
import { getPrisma } from "@/lib/prisma";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prisma = await getPrisma();
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? `Browse ${category.name} e-books on AXTO.dev.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const prisma = await getPrisma();
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const books = await getBooksByCategorySlug(slug);

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">{category.name}</h1>
        {category.description && <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>}
      </div>

      {books.length === 0 ? (
        <p className="text-muted-foreground">No e-books published in this category yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={{
                id: book.id,
                slug: book.slug,
                title: book.translations[0]?.title ?? book.slug,
                categoryName: category.name,
                priceCents: book.priceCents,
                compareAtCents: book.compareAtCents,
                coverImageUrl: book.coverImageUrl,
                isBestSeller: book.isBestSeller,
                isNew: book.isNew,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
