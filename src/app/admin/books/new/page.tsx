import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrisma } from "@/lib/prisma";
import { createBookAction } from "@/server/admin-actions";

export const metadata = { title: "Admin · New Book" };

export default async function NewBookPage() {
  const prisma = await getPrisma();
  const [categories, languages] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.language.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl font-bold">New book</h1>
      <form action={createBookAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select id="categoryId" name="categoryId" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="languageId">Primary language</Label>
          <select id="languageId" name="languageId" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nativeName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="priceUsd">Price (USD)</Label>
          <Input id="priceUsd" name="priceUsd" type="number" min="1" step="0.01" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="licenseType">License</Label>
          <select id="licenseType" name="licenseType" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="ORIGINAL">100% Original</option>
            <option value="PUBLIC_DOMAIN">Public Domain</option>
            <option value="PLR">PLR (redistribution licensed)</option>
            <option value="MRR">MRR (resale rights)</option>
            <option value="ROYALTY_FREE">Royalty-Free</option>
            <option value="AI_ASSISTED_ORIGINAL">AI-Assisted Original</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <Button type="submit" variant="gold">
          Create draft
        </Button>
      </form>
    </div>
  );
}
