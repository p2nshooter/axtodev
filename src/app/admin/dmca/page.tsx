import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · DMCA Claims" };

export default async function AdminDmcaPage() {
  const prisma = await getPrisma();
  const claims = await prisma.dmcaClaim.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">DMCA & Copyright Claims</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Submitted via /legal/copyright. Review evidence, then unpublish/restore the affected book from Books.
      </p>
      <div className="mt-6 space-y-3">
        {claims.map((claim) => (
          <div key={claim.id} className="rounded-lg border border-border p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{claim.claimantName}</span>
              <Badge variant="outline">{claim.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{claim.claimantEmail} · {formatDate(claim.createdAt)}</p>
            <p className="mt-2">{claim.description}</p>
          </div>
        ))}
        {claims.length === 0 && <p className="text-sm text-muted-foreground">No claims received.</p>}
      </div>
    </div>
  );
}
