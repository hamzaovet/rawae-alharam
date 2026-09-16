"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/slug";
import { saveUploadedFile } from "@/lib/upload";

export async function createProduct(formData: FormData): Promise<void> {
  const title = formData.get("title") as string;
  const rawSlug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;

  if (!title) return;

  const slug = generateSlug(title, rawSlug);
  
  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUploadedFile(imageFile);
  }

  const images = imageUrl ? [imageUrl] : [];

  try {
    await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        stock,
        categoryId,
        images,
      },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
