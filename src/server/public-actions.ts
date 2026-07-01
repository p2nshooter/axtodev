"use server";

import { getPrisma } from "@/lib/prisma";

export async function submitDmcaClaimAction(formData: FormData) {
  const prisma = await getPrisma();

  const claimantName = String(formData.get("claimantName") ?? "").trim();
  const claimantEmail = String(formData.get("claimantEmail") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const evidenceUrl = String(formData.get("evidenceUrl") ?? "").trim() || null;

  if (!claimantName || !claimantEmail || !description) {
    throw new Error("Name, email, and a description of the claim are required.");
  }

  await prisma.dmcaClaim.create({
    data: { claimantName, claimantEmail, description, evidenceUrl, status: "RECEIVED" },
  });
}
