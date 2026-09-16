"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTheme(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const secondaryColor = formData.get("secondaryColor") as string;
  const bgColor = formData.get("bgColor") as string;
  const layoutType = formData.get("layoutType") as string;

  if (!name) return;

  try {
    await prisma.themeSetting.create({
      data: {
        name,
        nameAr: name,
        primaryColor: primaryColor || "#000000",
        secondaryColor: secondaryColor || "#ffffff",
        bgColor: bgColor || "#f3f4f6",
        layoutType: layoutType || "default",
      },
    });
    revalidatePath("/dashboard/themes");
    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
}

export async function activateTheme(id: string): Promise<void> {
  try {
    // Deactivate all themes
    await prisma.themeSetting.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate the selected theme
    await prisma.themeSetting.update({
      where: { id },
      data: { isActive: true },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/themes");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTheme(id: string): Promise<void> {
  try {
    await prisma.themeSetting.delete({
      where: { id },
    });
    revalidatePath("/dashboard/themes");
    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
}
