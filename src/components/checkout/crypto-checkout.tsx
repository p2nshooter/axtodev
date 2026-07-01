"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CryptoAsset } from "@/lib/constants";

interface Quote {
  paymentId: string;
  address: string;
  amount: string;
  rateUsd: string;
  expiresAt: string;
}

export function CryptoCheckout({
  orderId,
  orderNumber,
  asset,
  assetName,
  network,
}: {
  orderId: string;
  orderNumber: string;
  asset: CryptoAsset;
  assetName: string;
  network: string;
}) {
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [txHash, setTxHash] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reported, setReported] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function createQuote() {
      setLoading(true);
      const res = await fetch("/api/checkout/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, asset }),
      });
      if (cancelled) return;
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(body.error ?? "Could not create a crypto payment quote.");
        setLoading(false);
        return;
      }
      const data = (await res.json()) as Quote;
      setQuote(data);
      setLoading(false);
    }
    createQuote();
    return () => {
      cancelled = true;
    };
  }, [orderId, asset]);

  useEffect(() => {
    if (!quote) return;
    QRCode.toDataURL(quote.address, { width: 240, margin: 1 }).then(setQrDataUrl).catch(() => {});
  }, [quote]);

  useEffect(() => {
    if (!quote) return;
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(quote.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [quote]);

  const expired = quote ? secondsLeft <= 0 : false;
  const timeLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  function copyAddress() {
    if (!quote) return;
    navigator.clipboard.writeText(quote.address);
    toast.success("Address copied");
  }

  async function submitTxHash() {
    if (!quote || !txHash) return;
    setSubmitting(true);
    const res = await fetch("/api/checkout/crypto/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: quote.paymentId, txHash }),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error("Could not submit transaction hash.");
      return;
    }
    setReported(true);
    toast.success("Thanks! We'll confirm your payment shortly.");
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Fetching live {assetName} price…
      </div>
    );
  }

  if (!quote) {
    return <p className="text-center text-muted-foreground">Could not load a payment quote. Please go back and try again.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay with {assetName}</CardTitle>
        <CardDescription>
          Order {orderNumber} · {network}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {expired ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-destructive">This quote has expired. Prices move — please start a new payment.</p>
            <Button variant="gold" onClick={() => router.refresh()}>
              Get a new quote
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              {qrDataUrl && <img src={qrDataUrl} alt={`${assetName} address QR code`} className="rounded-md border border-border" />}
            </div>

            <div className="space-y-1">
              <Label>Send exactly</Label>
              <p className="font-serif text-2xl font-bold text-accent">
                {quote.amount} {asset.replace("_TRC20", "")}
              </p>
              <p className="text-xs text-muted-foreground">Live rate: 1 {asset.replace("_TRC20", "")} = ${quote.rateUsd} USD</p>
            </div>

            <div className="space-y-1">
              <Label>To address</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={quote.address} className="font-mono text-xs" />
                <Button type="button" variant="outline" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Quote expires in <span className="font-mono text-foreground">{timeLabel}</span>
            </p>

            {reported ? (
              <p className="rounded-md bg-secondary p-3 text-center text-sm">
                Transaction submitted for review. You&apos;ll get an email once it&apos;s confirmed.
              </p>
            ) : (
              <div className="space-y-2 border-t border-border pt-4">
                <Label htmlFor="txHash">Already sent it? Submit your transaction hash</Label>
                <div className="flex gap-2">
                  <Input id="txHash" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="0x… or tx id" />
                  <Button type="button" variant="secondary" onClick={submitTxHash} disabled={submitting || !txHash}>
                    {submitting ? "Submitting…" : "Submit"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Payments are confirmed manually after on-chain verification, usually within a few hours.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
