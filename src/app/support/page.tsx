import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = { title: "Support Center" };

const TOPICS = [
  { title: "Order & payment issues", body: "Payment pending, wrong amount, or a stuck checkout — email support@axto.dev with your order number." },
  { title: "Download problems", body: "Broken file or expired link? Visit your Library and generate a fresh download link — it's free and instant." },
  { title: "Account & security", body: "Reset your password from the sign-in page, or contact us to review recent sign-in activity." },
  { title: "Copyright concerns", body: "Use our DMCA & Copyright form for takedown requests." },
];

export default function SupportPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-serif text-3xl font-bold">Support Center</h1>
      <p className="mt-2 text-muted-foreground">
        Check the <Link href="/faq" className="text-accent hover:underline">FAQ</Link> first — most questions are answered there.
      </p>
      <div className="mt-8 grid gap-4">
        {TOPICS.map((topic) => (
          <Card key={topic.title}>
            <CardHeader>
              <CardTitle className="text-base">{topic.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{topic.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
