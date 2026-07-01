import { redirect } from "next/navigation";
import { BookCover } from "@/components/book/book-cover";
import { LanguageDownloadPanel } from "@/components/book/language-download-panel";
import { getCurrentSession } from "@/lib/session";
import { getUserLibrary } from "@/server/library-service";
import { formatUsd } from "@/lib/utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = { title: "My Library" };

export default async function LibraryPage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  const items = await getUserLibrary(session.user.id);

  return (
    <div className="container py-12">
      <h1 className="font-serif text-3xl font-bold">My Library</h1>
      <p className="mt-1 text-muted-foreground">Every e-book you&apos;ve purchased, ready to read.</p>

      {items.length === 0 ? (
        <p className="mt-10 text-muted-foreground">You haven&apos;t purchased any e-books yet.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {items.map((item) => {
            const t = item.book.translations.find((tr) => tr.language.code === "en") ?? item.book.translations[0];
            return (
              <div key={item.id} className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row">
                <div className="h-40 w-32 shrink-0 overflow-hidden rounded-md">
                  <BookCover title={t?.title ?? ""} seed={item.book.id} coverImageUrl={item.book.coverImageUrl} />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-accent">{item.book.category.name}</span>
                  <h2 className="font-serif text-lg font-semibold">{t?.title}</h2>
                  <p className="text-sm text-muted-foreground">Purchased {formatUsd(item.unitPriceCents)}</p>
                  <div className="mt-3">
                    <LanguageDownloadPanel
                      bookId={item.book.id}
                      languages={item.book.translations.map((tr) => ({
                        id: tr.language.id,
                        code: tr.language.code,
                        nativeName: tr.language.nativeName,
                      }))}
                      grantedLanguageIds={item.grantedLanguageIds}
                      formats={["PDF", "EPUB"]}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
