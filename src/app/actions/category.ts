"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/slug";
import { saveUploadedFile } from "@/lib/upload";

export async function createCategory(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const rawSlug = formData.get("slug") as string;
  const imageFile = formData.get("image") as File | null;

  if (!name) return;

  const slug = generateSlug(name, rawSlug);

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUploadedFile(imageFile);
  }

  try {
    await prisma.category.create({
      data: { name, slug, image: imageUrl },
    });
    revalidatePath("/dashboard/categories");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

export async function updateCategory(id: string, formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File | null;
  if (!name) return;

  let newImageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    newImageUrl = await saveUploadedFile(imageFile);
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.category.update({
    where: { id },
    data: {
      name,
      image: newImageUrl ?? existing.image,
    },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/");
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/dashboard/categories");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting category:", error);
  }
}
