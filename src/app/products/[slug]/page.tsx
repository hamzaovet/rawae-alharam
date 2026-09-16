import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { AddToCartBtn } from "@/components/AddToCartBtn";
import Link from "next/link";
import { ZoomGallery } from "@/components/ZoomGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    take: 4,
  });

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[var(--theme-primary)]">الرئيسية</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[var(--theme-primary)]">المنتجات</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-[var(--theme-primary)]">{product.category.name}</Link>
          <span>/</span>
          <span style={{ color: "var(--theme-primary)" }}>{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Gallery with Zoom */}
          <ZoomGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "var(--theme-secondary)", color: "#000" }}>
                {product.category.name}
              </span>
              <h1 className="text-3xl font-bold mt-3" style={{ color: "var(--theme-text)" }}>{product.title}</h1>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold" style={{ color: "var(--theme-primary)" }}>{product.price} ج.م</span>
              {product.stock > 0 ? (
                <span className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">✅ متوفر ({product.stock})</span>
              ) : (
                <span className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">نفد المخزون</span>
              )}
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed border-r-4 pr-4" style={{ borderColor: "var(--theme-secondary)" }}>
                {product.description}
              </div>
            )}

            <div className="space-y-3 pt-2">
              {product.stock > 0 && (
                <AddToCartBtn id={product.id} title={product.title} price={product.price} image={product.images[0] || ""} />
              )}
              <a
                href={`https://wa.me/201127968425?text=${encodeURIComponent(`أريد الاستفسار عن: ${product.title} - السعر: ${product.price} ج.م`)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--theme-radius)] border-2 font-bold text-sm transition-colors hover:bg-green-50"
                style={{ borderColor: "#25d366", color: "#25d366" }}>
                <span>💬</span> استفسر عبر واتساب
              </a>
            </div>

            <div className="bg-white/60 rounded-[var(--theme-radius)] p-4 border text-sm space-y-2" style={{ borderColor: "var(--theme-secondary)" }}>
              <p>🚚 <strong>التوصيل:</strong> متاح لجميع أنحاء الجمهورية</p>
              <p>🔄 <strong>الاستبدال والإرجاع:</strong> خلال 14 يوم</p>
              <p>✨ <strong>الجودة:</strong> مضمونة 100%</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--theme-primary)" }}>منتجات مشابهة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/products/${r.slug}`}
                  className="bg-white rounded-[var(--theme-radius)] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  {r.images[0] && (
                    <img src={r.images[0]} alt={r.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform" />
                  )}
                  <div className="p-3">
                    <p className="font-bold text-sm line-clamp-2">{r.title}</p>
                    <p className="font-bold mt-1" style={{ color: "var(--theme-primary)" }}>{r.price} ج.م</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
