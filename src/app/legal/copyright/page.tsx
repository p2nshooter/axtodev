import { LegalPage } from "@/components/site/legal-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitDmcaClaimAction } from "@/server/public-actions";

export const metadata = { title: "Copyright & DMCA" };

export default function CopyrightPage() {
  return (
    <LegalPage title="Copyright & DMCA Policy" updated="July 2026">
      <p>
        AXTO.dev only publishes original, public-domain, or properly licensed e-books. If you believe an e-book on
        AXTO.dev infringes your copyright, submit a claim below and we will review it, temporarily unpublish the
        content if warranted, and respond.
      </p>

      <form action={submitDmcaClaimAction} className="mt-8 space-y-4 rounded-lg border border-border p-5 not-prose">
        <div className="space-y-1.5">
          <Label htmlFor="claimantName">Your name</Label>
          <Input id="claimantName" name="claimantName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="claimantEmail">Your email</Label>
          <Input id="claimantEmail" name="claimantEmail" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="evidenceUrl">Link to the AXTO.dev e-book (optional)</Label>
          <Input id="evidenceUrl" name="evidenceUrl" type="url" placeholder="https://axto.dev/books/…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Describe the infringement and your ownership</Label>
          <textarea id="description" name="description" rows={5} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <Button type="submit" variant="gold">
          Submit claim
        </Button>
      </form>
    </LegalPage>
  );
}
