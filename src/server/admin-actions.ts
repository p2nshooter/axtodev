"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireSuperAdmin } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { confirmCryptoPayment } from "@/lib/crypto-payment";
import { setSetting, SETTING_KEYS, type SettingKey } from "@/server/settings-service";

async function logAdminAction(action: string, entity: string, entityId: string, metadata?: unknown) {
  const prisma = await getPrisma();
  const admin = await requireAdmin();
  await prisma.auditLog.create({
    data: { userId: admin.id, action, entity, entityId, metadata: metadata ? JSON.stringify(metadata) : undefined },
  });
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const prisma = await getPrisma();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const category = await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description: String(formData.get("description") ?? "") || null,
      featured: formData.get("featured") === "on",
    },
  });

  await logAdminAction("category.create", "Category", category.id);
  revalidatePath("/admin/categories");
}

export async function createBookAction(formData: FormData) {
  const admin = await requireAdmin();
  const prisma = await getPrisma();

  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const priceCents = Math.round(Number(formData.get("priceUsd") ?? "0") * 100);
  const languageId = String(formData.get("languageId") ?? "");
  const description = String(formData.get("description") ?? "");
  const licenseType = String(formData.get("licenseType") ?? "ORIGINAL");

  if (!title || !categoryId || !languageId || priceCents <= 0) {
    throw new Error("Title, category, language and a positive price are required.");
  }

  const book = await prisma.book.create({
    data: {
      slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`,
      categoryId,
      priceTier: priceTierForCents(priceCents),
      priceCents,
      status: "DRAFT",
      licenseType,
      author: "AXTO.dev",
      translations: {
        create: [{ languageId, title, description }],
      },
      statusHistory: { create: [{ status: "DRAFT", changedBy: admin.id }] },
    },
  });

  await logAdminAction("book.create", "Book", book.id);
  revalidatePath("/admin/books");
  redirect(`/admin/books/${book.id}/edit`);
}

export async function updateBookStatusAction(bookId: string, status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED") {
  const admin = await requireAdmin();
  const prisma = await getPrisma();

  await prisma.book.update({
    where: { id: bookId },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : undefined },
  });
  await prisma.bookStatusHistory.create({ data: { bookId, status, changedBy: admin.id } });

  await logAdminAction("book.status_change", "Book", bookId, { status });
  revalidatePath("/admin/books");
}

export async function confirmCryptoPaymentAction(formData: FormData) {
  const admin = await requireAdmin();
  const paymentId = String(formData.get("paymentId") ?? "");
  const txHash = String(formData.get("txHash") ?? "");
  if (!paymentId || !txHash) throw new Error("paymentId and txHash are required.");

  await confirmCryptoPayment(paymentId, txHash, admin.id);
  await logAdminAction("payment.crypto.confirmed", "Payment", paymentId, { txHash });
  revalidatePath("/admin/orders");
}

export async function createCouponAction(formData: FormData) {
  await requireAdmin();
  const prisma = await getPrisma();

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const type = String(formData.get("type") ?? "PERCENTAGE") as "PERCENTAGE" | "FIXED";
  const value = Number(formData.get("value") ?? "0");
  if (!code || value <= 0) throw new Error("Code and a positive value are required.");

  const coupon = await prisma.coupon.create({
    data: { code, type, value: type === "FIXED" ? Math.round(value * 100) : Math.round(value) },
  });

  await logAdminAction("coupon.create", "Coupon", coupon.id);
  revalidatePath("/admin/coupons");
}

export async function updateSettingAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "").trim();

  if (!SETTING_KEYS.includes(key as SettingKey)) throw new Error("Unknown setting key.");
  if (!value) throw new Error("Value cannot be empty — leave the form untouched to keep the current value.");

  await setSetting(key as SettingKey, value, admin.id);
  revalidatePath("/admin/settings");
}

function priceTierForCents(cents: number) {
  if (cents <= 500) return "TIER_1_BASICS";
  if (cents <= 1500) return "TIER_2_SKILL";
  if (cents <= 3000) return "TIER_3_GROWTH";
  if (cents <= 7000) return "TIER_4_BUSINESS";
  if (cents <= 15000) return "TIER_5_PREMIUM";
  return "TIER_6_SUPER_PREMIUM";
}
