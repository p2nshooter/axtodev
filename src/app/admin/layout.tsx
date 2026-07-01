import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, BookOpen, FolderTree, ShoppingBag, Tag, Newspaper, ShieldAlert } from "lucide-react";
import { getCurrentSession } from "@/lib/session";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders & Payments", icon: ShoppingBag },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/dmca", label: "DMCA Claims", icon: ShieldAlert },
];

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN", "EDITOR", "SUPPORT"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;

  if (!session?.user) redirect("/login");
  if (!role || !ADMIN_ROLES.has(role)) redirect("/");

  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-1">
        <h2 className="mb-3 px-2 font-serif text-lg font-bold">Admin</h2>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <item.icon className="h-4 w-4" /> {item.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
