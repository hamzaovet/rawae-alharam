import prisma from "@/lib/prisma";
import { activateDeal, deactivateDeal, deleteDeal, createDeal } from "@/app/actions/deal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function DealsPage() {
  const [deals, products] = await Promise.all([
    prisma.weeklyDeal.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ include: { category: true }, orderBy: { title: "asc" } }),
  ]);

  const discount = (orig: number, deal: number) => Math.round(((orig - deal) / orig) * 100);

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold">عروض الأسبوع</h1>
        <p className="text-gray-500 text-sm mt-1">أنشئ باقات مميزة بسعر خاص تظهر في الصفحة الرئيسية</p>
      </div>

      {/* Create Deal Form */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">➕ إنشاء عرض جديد</h2>
        <form action={createDeal} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان العرض</label>
              <Input name="title" placeholder="مثال: باقة الحاج والمعتمر" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تاريخ الانتهاء</label>
              <Input name="expiresAt" type="datetime-local" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">سعر العرض (ج.م)</label>
              <Input name="dealPrice" type="number" placeholder="899" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">السعر الأصلي (ج.م)</label>
              <Input name="originalPrice" type="number" placeholder="1200" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">وصف العرض</label>
              <Input name="description" placeholder="وصف مختصر للعرض..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">المنتجات المشمولة في العرض (اختر أكثر من منتج)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {products.map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded">
                  <input type="checkbox" name="productIds" value={p.id} className="rounded" />
                  <span className="text-sm">{p.title} <span className="text-gray-400">({p.price} ج.م)</span></span>
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
            🎯 إنشاء العرض
          </Button>
        </form>
      </div>

      {/* Deals List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">العروض الحالية ({deals.length})</h2>
        {deals.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white border rounded-xl">
            <p className="text-4xl mb-3">🎯</p>
            <p>لا توجد عروض حالياً — أنشئ عرضك الأول!</p>
          </div>
        ) : (
          deals.map((deal) => (
            <div key={deal.id} className={`bg-white border-2 rounded-xl p-5 shadow-sm ${deal.isActive ? "border-amber-400" : "border-gray-200"}`}>
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{deal.title}</h3>
                    {deal.isActive && <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">🔥 مفعّل</span>}
                  </div>
                  {deal.description && <p className="text-gray-500 text-sm mb-2">{deal.description}</p>}
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-green-600">{deal.dealPrice} ج.م</span>
                    <span className="text-gray-400 line-through">{deal.originalPrice} ج.م</span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                      خصم {discount(deal.originalPrice, deal.dealPrice)}%
                    </span>
                  </div>
                  {deal.expiresAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      ينتهي: {new Date(deal.expiresAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {deal.isActive ? (
                    <form action={deactivateDeal.bind(null, deal.id)}>
                      <Button type="submit" variant="outline" size="sm">إيقاف العرض</Button>
                    </form>
                  ) : (
                    <form action={activateDeal.bind(null, deal.id)}>
                      <Button type="submit" size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">تفعيل</Button>
                    </form>
                  )}
                  <form action={deleteDeal.bind(null, deal.id)}>
                    <Button type="submit" variant="outline" size="sm" className="text-red-500 border-red-200">حذف</Button>
                  </form>
                </div>
              </div>
              {deal.items.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium mb-2">المنتجات المشمولة ({deal.items.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {deal.items.map((item) => (
                      <span key={item.id} className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1 rounded-full">
                        {item.product.title} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
