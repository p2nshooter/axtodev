"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { BookCover } from "@/components/book/book-cover";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/checkout/cart-store";
import { formatUsd } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.priceCents, 0);

  async function checkout() {
    if (!session?.user) {
      toast.info("Sign in to check out.");
      router.push("/login");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((i) => ({ bookId: i.bookId, unitPriceCents: i.priceCents })) }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      toast.error(body.error ?? "Could not start checkout.");
      return;
    }
    const { orderId } = (await res.json()) as { orderId: string };
    router.push(`/checkout/pay/${orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold">Your cart is empty</h1>
        <Button variant="gold" asChild>
          <Link href="/search">Browse e-books</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-12 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-serif text-3xl font-bold">Your Cart</h1>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.bookId} className="flex items-center gap-4 rounded-lg border border-border p-3">
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded">
                <BookCover title={item.title} seed={item.bookId} coverImageUrl={item.coverImageUrl} />
              </div>
              <div className="flex-1">
                <Link href={`/books/${item.slug}`} className="font-medium hover:text-accent">
                  {item.title}
                </Link>
              </div>
              <span className="font-semibold">{formatUsd(item.priceCents)}</span>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.bookId)} aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-lg border border-border p-5">
        <h2 className="font-serif text-lg font-semibold">Order Summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatUsd(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatUsd(subtotal)}</span>
        </div>
        <Button variant="gold" className="mt-5 w-full" onClick={checkout} disabled={loading}>
          {loading ? "Preparing checkout…" : "Checkout"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
