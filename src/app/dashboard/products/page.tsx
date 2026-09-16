import prisma from "@/lib/prisma";
import { ProductsClient } from "./client";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <ProductsClient products={products} categories={categories} />;
}
