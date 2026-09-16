"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDeal(formData: FormData): Promise<void> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dealPrice = parseFloat(formData.get("dealPrice") as string);
  const originalPrice = parseFloat(formData.get("originalPrice") as string);
  const productIds = formData.getAll("productIds") as string[];
  const expiresAt = formData.get("expiresAt") as string;

  if (!title || isNaN(dealPrice)) return;

  try {
    await prisma.weeklyDeal.create({
      data: {
        title,
        description,
        dealPrice,
        originalPrice: originalPrice || dealPrice,
        isActive: true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        items: { create: productIds.map((id) => ({ productId: id, quantity: 1 })) },
      },
    });
    revalidatePath("/dashboard/deals");
    revalidatePath("/");
  } catch (e) {
    console.error("Error creating deal:", e);
  }
}

export async function activateDeal(id: string): Promise<void> {
  try {
    await prisma.weeklyDeal.updateMany({ where: { isActive: true }, data: { isActive: false } });
    await prisma.weeklyDeal.update({ where: { id }, data: { isActive: true } });
    revalidatePath("/");
    revalidatePath("/dashboard/deals");
  } catch (e) {
    console.error(e);
  }
}

export async function deactivateDeal(id: string): Promise<void> {
  try {
    await prisma.weeklyDeal.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/");
    revalidatePath("/dashboard/deals");
  } catch (e) {
    console.error(e);
  }
}

export async function deleteDeal(id: string): Promise<void> {
  try {
    await prisma.weeklyDeal.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/dashboard/deals");
  } catch (e) {
    console.error(e);
  }
}
