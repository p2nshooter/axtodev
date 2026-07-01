"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/checkout/cart-store";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <CheckCircle2 className="h-14 w-14 text-accent" />
      <h1 className="font-serif text-3xl font-bold">Payment confirmed</h1>
      {orderNumber && <p className="text-muted-foreground">Order {orderNumber} is ready in your library.</p>}
      <Button variant="gold" asChild>
        <Link href="/library">Go to my library</Link>
      </Button>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
