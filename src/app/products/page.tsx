import prisma from "@/lib/prisma";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AddToCartBtn } from "@/components/AddToCartBtn";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const activeCategory = params.category || "";
  const searchQ = params.q || "";

  const products = await prisma.product.findMany({
    where: {
      ...(activeCategory ? { category: { slug: activeCategory } } : {}),
      ...(searchQ ? { title: { contains: searchQ, mode: "insensitive" } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--theme-primary)" }}>
            {activeCategory ? categories.find(c => c.slug === activeCategory)?.name || "المنتجات" : "جميع المنتجات"}
          </h1>
          <p className="text-gray-500 mt-1">{products.length} منتج</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <form className="flex-1 min-w-[200px]">
            <input name="q" defaultValue={searchQ} placeholder="ابحث عن منتج..."
              className="w-full px-4 py-2 border rounded-[var(--theme-radius)] focus:outline-none focus:border-[var(--theme-primary)] bg-white"
              style={{ borderColor: "var(--theme-secondary)" }} />
            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/products"
            className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${!activeCategory ? "text-white" : "border-gray-300 text-gray-600 hover:border-[var(--theme-primary)]"}`}
            style={!activeCategory ? { backgroundColor: "var(--theme-primary)", borderColor: "var(--theme-primary)" } : {}}>
            الكل
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/products?category=${c.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${activeCategory === c.slug ? "text-white" : "border-gray-300 text-gray-600 hover:border-[var(--theme-primary)]"}`}
              style={activeCategory === c.slug ? { backgroundColor: "var(--theme-primary)", borderColor: "var(--theme-primary)" } : {}}>
              {c.icon} {c.name}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-[var(--theme-radius)] overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group flex flex-col">
                <Link href={`/products/${p.slug}`} className="block overflow-hidden">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-5xl bg-gray-50">🛍️</div>
                  )}
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <span className="text-xs text-gray-400 mb-1">{p.category.name}</span>
                  <Link href={`/products/${p.slug}`}>
                    <h3 className="font-bold text-sm leading-tight mb-2 hover:text-[var(--theme-primary)] line-clamp-2">{p.title}</h3>
                  </Link>
                  <p className="font-bold text-lg mt-auto mb-2" style={{ color: "var(--theme-primary)" }}>{p.price} ج.م</p>
                  <AddToCartBtn id={p.id} title={p.title} price={p.price} image={p.images[0] || ""} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
