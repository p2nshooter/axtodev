import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/session";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = { title: "Account Settings" };

export default async function AccountPage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="container max-w-lg py-12">
      <h1 className="font-serif text-3xl font-bold">Account Settings</h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your AXTO.dev account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border py-2">
            <span className="text-muted-foreground">Name</span>
            <span>{session.user.name}</span>
          </div>
          <div className="flex justify-between border-b border-border py-2">
            <span className="text-muted-foreground">Email</span>
            <span>{session.user.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Email verified</span>
            <span>{session.user.emailVerified ? "Yes" : "No"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
