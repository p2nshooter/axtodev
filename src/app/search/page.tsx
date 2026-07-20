import { Suspense } from "react";
import { SearchClient, type SearchDoc } from "@/components/search/search-client";
import { LIBRARY } from "@/content/library";
import { EDITORIAL_POSTS } from "@/content/editorial-posts";

export const metadata = { title: "Search the library" };

// Static shell + client-side filtering over a code-shipped index. Searching
// never touches the server (the old Prisma search was the page the owner
// caught red-handed with Error 1102).
export default function SearchPage() {
  const docs: SearchDoc[] = [
    ...LIBRARY.map((b) => ({
      type: "book" as const,
      slug: b.slug,
      title: b.title,
      description: b.description,
      extra: `${b.author} · ${b.minutes} min · Free to read & listen`,
    })),
    ...EDITORIAL_POSTS.map((p) => ({
      type: "article" as const,
      slug: p.slug,
      title: p.title,
      description: p.excerpt,
      extra: `Article · ${p.minutes} min read · Free`,
    })),
  ];

  return (
    <div className="container py-12">
      <h1 className="mb-6 font-serif text-3xl font-bold">Search</h1>
      <Suspense>
        <SearchClient docs={docs} />
      </Suspense>
    </div>
  );
}
