"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveUploadedFile } from "@/lib/upload";

export async function updateProduct(id: string, formData: FormData): Promise<void> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "true";

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return;

  const imageFile = formData.get("image") as File | null;
  let newImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    newImageUrl = await saveUploadedFile(imageFile);
  }

  const updatedImages = newImageUrl
    ? [...existing.images, newImageUrl].slice(0, 8)
    : existing.images;

  await prisma.product.update({
    where: { id },
    data: {
      title,
      description,
      price,
      stock,
      categoryId,
      isFeatured,
      images: updatedImages,
    },
  });

  revalidatePath("/dashboard/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function addProductImageAction(formData: FormData): Promise<void> {
  const id = formData.get("productId") as string;
  const imageFile = formData.get("image") as File | null;
  if (!id || !imageFile || imageFile.size === 0) return;

  const url = await saveUploadedFile(imageFile);
  if (!url) return;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.product.update({
    where: { id },
    data: { images: [...existing.images, url].slice(0, 8) },
  });

  revalidatePath("/dashboard/products");
  revalidatePath(`/products/${existing.slug}`);
  revalidatePath("/");
}

export async function removeProductImageAction(formData: FormData): Promise<void> {
  const id = formData.get("productId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  if (!id || !imageUrl) return;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.product.update({
    where: { id },
    data: { images: existing.images.filter((img) => img !== imageUrl) },
  });

  revalidatePath("/dashboard/products");
  revalidatePath(`/products/${existing.slug}`);
  revalidatePath("/");
}
