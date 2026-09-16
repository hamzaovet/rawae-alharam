"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, deleteCategory, updateCategory } from "@/app/actions/category";

type Category = { id: string; name: string; slug: string; icon: string | null; image: string | null; createdAt: Date };

export function CategoriesClient({ categories }: { categories: Category[] }) {
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800">إدارة الأقسام</h1>
        <p className="text-gray-400 text-sm mt-1">أضف أقساماً جديدة أو عدّل الموجودة مع رفع صورة مناسبة لكل قسم</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ADD FORM */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold">+</div>
            <h2 className="font-bold text-gray-800">إضافة قسم جديد</h2>
          </div>
          <form action={createCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                اسم القسم <span className="text-red-500">*</span>
              </label>
              <Input name="name" placeholder="مثال: عبايات رجالي" required className="h-10" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                الرابط (Slug) <span className="text-gray-400 font-normal">(اختياري)</span>
              </label>
              <Input name="slug" placeholder="اختياري — يتولد تلقائياً" dir="ltr" className="h-10 text-left font-mono text-sm" />
              <p className="text-[11px] text-gray-400 mt-1">اتركه فارغاً ليتم توليده تلقائياً من الاسم العربي</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">صورة القسم</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-green-400 transition-colors">
                <Input type="file" name="image" accept="image/*" className="cursor-pointer" />
                <p className="text-[11px] text-gray-400 mt-2">PNG, JPG — ستُرفع تلقائياً عبر ImgBB</p>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl">
              إضافة القسم
            </Button>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800">الأقسام الحالية</h2>
            <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">{categories.length} قسم</span>
          </div>

          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl border p-16 text-center text-gray-400">
              <p className="text-5xl mb-3">🗂️</p>
              <p className="font-medium">لا توجد أقسام بعد</p>
              <p className="text-sm mt-1">أضف أول قسم باستخدام النموذج</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{cat.icon || "🗂️"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800">{cat.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5" dir="ltr">{cat.slug}</p>
                    {!cat.image && (
                      <span className="inline-block mt-1 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                        ⚠️ لا توجد صورة — يُفضّل رفع صورة واضحة
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant={editId === cat.id ? "default" : "outline"}
                      onClick={() => setEditId(editId === cat.id ? null : cat.id)}
                      className={editId === cat.id ? "bg-blue-600 text-white" : "text-blue-600 border-blue-200"}
                    >
                      {editId === cat.id ? "إغلاق ✕" : "✏️ تعديل"}
                    </Button>
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <Button type="submit" size="sm" variant="destructive" className="rounded-lg">حذف</Button>
                    </form>
                  </div>
                </div>

                {/* Edit Panel */}
                {editId === cat.id && (
                  <div className="border-t bg-blue-50/40 p-5">
                    <h3 className="text-sm font-bold text-blue-800 mb-4">
                      ✏️ تعديل قسم: <span className="text-blue-600">{cat.name}</span>
                    </h3>
                    <form action={updateCategory.bind(null, cat.id)} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">اسم القسم</label>
                        <Input name="name" defaultValue={cat.name} required className="h-10 bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">تغيير صورة القسم</label>
                        {cat.image && (
                          <div className="mb-3 flex items-center gap-3 bg-white rounded-xl border p-3">
                            <img src={cat.image} alt="الصورة الحالية" className="w-24 h-16 object-cover rounded-lg border flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-gray-700">الصورة الحالية</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">ارفع صورة جديدة لاستبدالها</p>
                            </div>
                          </div>
                        )}
                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 bg-white hover:border-blue-400 transition-colors">
                          <Input type="file" name="image" accept="image/*" className="cursor-pointer" />
                          <p className="text-[11px] text-gray-400 mt-1.5 text-center">
                            {cat.image ? "اختر صورة جديدة لاستبدال الحالية" : "اختر صورة للقسم (PNG, JPG)"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm"
                          className="bg-green-700 hover:bg-green-800 text-white flex-1 h-10 rounded-xl font-bold">
                          💾 حفظ التعديلات
                        </Button>
                        <Button type="button" size="sm" variant="outline"
                          onClick={() => setEditId(null)} className="h-10 px-5">
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


