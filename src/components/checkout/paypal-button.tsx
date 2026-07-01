"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PayPalButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  async function startPayPal() {
    setLoading(true);
    const res = await fetch("/api/checkout/paypal/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      toast.error(body.error ?? "Could not start PayPal checkout.");
      setLoading(false);
      return;
    }
    const { approveUrl } = (await res.json()) as { approveUrl: string };
    window.location.href = approveUrl;
  }

  return (
    <Button variant="gold" className="w-full" onClick={startPayPal} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      Continue to PayPal
    </Button>
  );
}
