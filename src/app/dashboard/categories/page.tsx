import prisma from "@/lib/prisma";
import { CategoriesClient } from "./client";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });
  return <CategoriesClient categories={categories} />;
}
