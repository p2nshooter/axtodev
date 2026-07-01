import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/utils";

export const metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const prisma = await getPrisma();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [revenueAgg, salesToday, totalBooks, publishedBooks, totalCustomers, pendingCrypto, failedPayments, downloadsToday] =
    await Promise.all([
      prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true } }),
      prisma.order.count({ where: { status: "PAID", paidAt: { gte: startOfToday } } }),
      prisma.book.count(),
      prisma.book.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.payment.count({ where: { status: "PENDING", provider: { not: "PAYPAL" } } }),
      prisma.payment.count({ where: { status: "FAILED" } }),
      prisma.downloadLog.count({ where: { createdAt: { gte: startOfToday } } }),
    ]);

  const stats = [
    { label: "Total Revenue", value: formatUsd(revenueAgg._sum.totalCents ?? 0) },
    { label: "Sales Today", value: salesToday },
    { label: "Published / Total Books", value: `${publishedBooks} / ${totalBooks}` },
    { label: "Customers", value: totalCustomers },
    { label: "Pending Crypto Payments", value: pendingCrypto },
    { label: "Failed Payments", value: failedPayments },
    { label: "Downloads Today", value: downloadsToday },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
