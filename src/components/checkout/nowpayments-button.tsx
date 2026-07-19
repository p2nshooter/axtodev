"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NowPaymentsButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    const res = await fetch("/api/checkout/nowpayments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      toast.error(body.error ?? "Crypto instant checkout is unavailable right now.");
      setLoading(false);
      return;
    }
    const { invoiceUrl } = (await res.json()) as { invoiceUrl: string };
    window.location.href = invoiceUrl;
  }

  return (
    <Button variant="gold" className="w-full" onClick={start} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
      Pay with Crypto — Instant
    </Button>
  );
}
