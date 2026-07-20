import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "No registration needed",
  robots: { index: false },
};

// Registration is retired: the whole library is free to read and listen to
// without an account (owner: "tanpa ada register"). Old /register links land
// here and are warmly redirected into the library.
export default function RegisterPage() {
  return (
    <div className="container flex max-w-lg flex-col items-center py-24 text-center">
      <h1 className="font-serif text-3xl font-bold">No account needed</h1>
      <p className="mt-4 text-muted-foreground">
        Everything on AXTO.dev is free to read and free to listen to, in your own language — there is
        nothing to register for. Just open a book and start.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="gold" asChild>
          <Link href="/books">
            <BookOpen className="h-4 w-4" /> Browse the library
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blog">
            <Headphones className="h-4 w-4" /> Listen to an article
          </Link>
        </Button>
      </div>
    </div>
  );
}
