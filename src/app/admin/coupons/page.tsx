import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrisma } from "@/lib/prisma";
import { createCouponAction } from "@/server/admin-actions";

export const metadata = { title: "Admin · Coupons" };

export default async function AdminCouponsPage() {
  const prisma = await getPrisma();
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="font-serif text-2xl font-bold">Coupons</h1>
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Value</th>
                <th className="p-3">Used</th>
                <th className="p-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-mono">{c.code}</td>
                  <td className="p-3">{c.type === "PERCENTAGE" ? `${c.value}%` : `$${(c.value / 100).toFixed(2)}`}</td>
                  <td className="p-3">
                    {c.redemptions}
                    {c.maxRedemptions ? ` / ${c.maxRedemptions}` : ""}
                  </td>
                  <td className="p-3">
                    <Badge variant={c.active ? "gold" : "outline"}>{c.active ? "Active" : "Inactive"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form action={createCouponAction} className="h-fit space-y-4 rounded-lg border border-border p-5">
        <h2 className="font-serif text-lg font-semibold">New coupon</h2>
        <div className="space-y-1.5">
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" required className="uppercase" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <select id="type" name="type" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="PERCENTAGE">Percentage off</option>
            <option value="FIXED">Fixed amount off (USD)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="value">Value</Label>
          <Input id="value" name="value" type="number" step="0.01" min="0" required />
        </div>
        <Button type="submit" variant="gold" className="w-full">
          Create coupon
        </Button>
      </form>
    </div>
  );
}
