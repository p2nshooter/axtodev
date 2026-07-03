import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/session";
import { getSettingsStatus } from "@/server/settings-service";
import { updateSettingAction } from "@/server/admin-actions";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Integration Settings" };

export default async function AdminSettingsPage() {
  const session = await getCurrentSession();
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;
  if (!session?.user) redirect("/login");
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/admin");

  const statuses = await getSettingsStatus();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Integration Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Credentials here are AES-256-GCM encrypted at rest and never appear in source code or logs. Only Admin /
        Super Admin can view this page — values are write-only (you can rotate them, never read back the current
        value here).
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {statuses.map((s) => (
          <Card key={s.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{s.label}</CardTitle>
                <Badge variant={s.configured ? "gold" : "outline"}>
                  {s.source === "database" ? "Encrypted in DB" : s.source === "environment" ? "Env fallback" : "Not set"}
                </Badge>
              </div>
              <CardDescription className="font-mono text-xs">{s.key}</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateSettingAction} className="flex gap-2">
                <input type="hidden" name="key" value={s.key} />
                <Label htmlFor={s.key} className="sr-only">
                  {s.label}
                </Label>
                <Input
                  id={s.key}
                  name="value"
                  type="password"
                  autoComplete="off"
                  placeholder={s.configured ? "•••••••••••• (enter to replace)" : "Enter value…"}
                  className="font-mono text-xs"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
