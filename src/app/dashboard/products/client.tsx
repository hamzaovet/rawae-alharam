"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct, deleteProduct } from "@/app/actions/product";
import { updateProduct, addProductImageAction, removeProductImageAction } from "@/app/actions/product-update";
import { generateProductDescription } from "@/app/actions/ai";
import { Sparkles, Loader2, ImagePlus, X, Check, AlertCircle } from "lucide-react";

type Product = {
  id: string; title: string; slug: string; description: string | null;
  price: number; stock: number; isFeatured: boolean; images: string[];
  category: { id: string; name: string };
};
type Category = { id: string; name: string };
type Props = { products: Product[]; categories: Category[] };

export function ProductsClient({ products, categories }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const editProduct = products.find((p) => p.id === editId);

  // AI Description states for Add form
  const [addTitle, setAddTitle] = useState("");
  const [addCategoryId, setAddCategoryId] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [isAiLoadingAdd, setIsAiLoadingAdd] = useState(false);

  // AI Description states for Edit form
  const [editDesc, setEditDesc] = useState<Record<string, string>>({});
  const [isAiLoadingEdit, setIsAiLoadingEdit] = useState(false);

  const handleAiGenerateAdd = async () => {
    if (!addTitle.trim()) {
      alert("يرجى كتابة اسم المنتج أولاً حتى يتمكن الذكاء الاصطناعي من صياغة الوصف!");
      return;
    }
    setIsAiLoadingAdd(true);
    const catName = categories.find((c) => c.id === addCategoryId)?.name;
    const res = await generateProductDescription(addTitle, catName);
    if (res.description) {
      setAddDesc(res.description);
    }
    setIsAiLoadingAdd(false);
  };

  const handleAiGenerateEdit = async (productId: string, title: string, catId: string) => {
    setIsAiLoadingEdit(true);
    const catName = categories.find((c) => c.id === catId)?.name;
    const res = await generateProductDescription(title, catName);
    if (res.description) {
      setEditDesc((prev) => ({ ...prev, [productId]: res.description! }));
    }
    setIsAiLoadingEdit(false);
  };

  return (
    <div dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800">إدارة المنتجات</h1>
        <p className="text-gray-400 text-sm mt-1">أضف منتجات جديدة أو عدّل الموجودة مع رفع وحفظ صور متعددة لكل منتج</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ADD PRODUCT FORM */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold">+</div>
            <h2 className="font-bold text-gray-800">إضافة منتج جديد</h2>
          </div>
          <form action={createProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">اسم المنتج <span className="text-red-500">*</span></label>
              <Input
                name="title"
                placeholder="مثال: عباءة رجالي فاخرة"
                required
                className="h-10"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                الرابط (Slug) <span className="text-gray-400 font-normal">(اختياري)</span>
              </label>
              <Input name="slug" placeholder="اختياري — يتولد تلقائياً" dir="ltr" className="h-10 text-left font-mono text-sm" />
              <p className="text-[11px] text-gray-400 mt-1">اتركه فارغاً ليتم توليده تلقائياً من الاسم العربي</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">القسم <span className="text-red-500">*</span></label>
              <select
                name="categoryId"
                value={addCategoryId}
                onChange={(e) => setAddCategoryId(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-white text-sm h-10"
                required
              >
                <option value="">اختر القسم...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">السعر (ج.م) <span className="text-red-500">*</span></label>
                <Input type="number" name="price" min="0" step="0.01" required className="h-10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">الكمية <span className="text-red-500">*</span></label>
                <Input type="number" name="stock" min="0" required className="h-10" />
              </div>
            </div>

            {/* Description with AI button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">وصف المنتج</label>
                <button
                  type="button"
                  onClick={handleAiGenerateAdd}
                  disabled={isAiLoadingAdd}
                  className="text-[11px] text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold transition-colors disabled:opacity-50"
                >
                  {isAiLoadingAdd ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-purple-600" />}
                  <span>{isAiLoadingAdd ? "جاري التوليد..." : "✨ توليد بالـ AI"}</span>
                </button>
              </div>
              <textarea
                name="description"
                value={addDesc}
                onChange={(e) => setAddDesc(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-white min-h-[80px] text-sm resize-none"
                placeholder="وصف تفصيلي للمنتج أو اضغط على توليد بالـ AI..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">الصورة الرئيسية للمنتج</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:border-green-400 transition-colors">
                <Input type="file" name="image" accept="image/*" className="cursor-pointer" />
                <p className="text-[11px] text-gray-400 mt-1.5">تُحفظ مباشرة في السيرفر وتظهر فوراً</p>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl">
              إضافة المنتج
            </Button>
          </form>
        </div>

        {/* PRODUCTS LIST */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800">المنتجات الحالية</h2>
            <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">{products.length} منتج</span>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border p-16 text-center text-gray-400">
              <p className="text-5xl mb-3">🛍️</p>
              <p className="font-medium">لا توجد منتجات بعد</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                      )}
                    </div>
                    {product.images.length > 1 && (
                      <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                        {product.images.length}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 line-clamp-1">{product.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-400">{product.category.name}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs font-bold text-green-700">{product.price} ج.م</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.stock > 5 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                        {product.stock > 0 ? `مخزون: ${product.stock}` : 'نفذت الكمية'}
                      </span>
                      {product.isFeatured && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">⭐ مميز</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant={editId === product.id ? "default" : "outline"}
                      onClick={() => setEditId(editId === product.id ? null : product.id)}
                      className={editId === product.id ? "bg-blue-600 text-white" : "text-blue-600 border-blue-200"}
                    >
                      {editId === product.id ? "إغلاق ✕" : "✏️ تعديل"}
                    </Button>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <Button type="submit" size="sm" variant="destructive" className="rounded-lg">حذف</Button>
                    </form>
                  </div>
                </div>

                {/* EDIT PANEL */}
                {editId === product.id && editProduct && (
                  <div className="border-t bg-blue-50/30 p-5 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-blue-900">
                        ✏️ تعديل المنتج: <span className="text-blue-600">{product.title}</span>
                      </h3>
                      <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border">
                        كود: {product.slug}
                      </span>
                    </div>

                    {/* EXISTING IMAGES GALLERY WITH DELETE OPTION */}
                    <div className="bg-white rounded-xl border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <span>📸 الصور الحالية للمنتج</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[11px] text-gray-600 font-normal">
                            ({product.images.length} من 8)
                          </span>
                        </span>
                        {product.images.length === 0 && (
                          <span className="text-[11px] text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> لا توجد صور بعد، اختر صورة من الأسفل
                          </span>
                        )}
                      </div>

                      {product.images.length > 0 ? (
                        <div className="flex gap-3 flex-wrap">
                          {product.images.map((img, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 shadow-xs hover:border-red-400 transition-colors">
                              <img src={img} alt={`صورة ${i + 1}`} className="w-20 h-20 object-cover" />
                              <span className="absolute top-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                {i === 0 ? "الرئيسية" : `#${i + 1}`}
                              </span>
                              {/* Delete single image */}
                              <form action={removeProductImageAction}>
                                <input type="hidden" name="productId" value={product.id} />
                                <input type="hidden" name="imageUrl" value={img} />
                                <button
                                  type="submit"
                                  title="حذف هذه الصورة"
                                  className="absolute bottom-1 left-1 bg-red-600 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-2">لا توجد صور حالياً للمنتج</p>
                      )}
                    </div>

                    {/* MAIN EDIT FORM - ALL IN ONE SUBMIT */}
                    <form action={updateProduct.bind(null, product.id)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">اسم المنتج</label>
                          <Input name="title" defaultValue={product.title} required className="h-10 bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">القسم</label>
                          <select name="categoryId" defaultValue={product.category.id}
                            className="w-full border rounded-xl p-2.5 bg-white text-sm h-10" required>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">السعر (ج.م)</label>
                          <Input type="number" name="price" defaultValue={product.price} required className="h-10 bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">الكمية في المخزون</label>
                          <Input type="number" name="stock" defaultValue={product.stock} required className="h-10 bg-white" />
                        </div>
                      </div>

                      {/* Description with AI */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-gray-600">وصف المنتج</label>
                          <button
                            type="button"
                            onClick={() => handleAiGenerateEdit(product.id, product.title, product.category.id)}
                            disabled={isAiLoadingEdit}
                            className="text-[11px] text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold transition-colors disabled:opacity-50"
                          >
                            {isAiLoadingEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-purple-600" />}
                            <span>{isAiLoadingEdit ? "جاري التوليد..." : "✨ توليد بالـ AI"}</span>
                          </button>
                        </div>
                        <textarea
                          name="description"
                          value={editDesc[product.id] ?? (product.description || "")}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditDesc((prev) => ({ ...prev, [product.id]: val }));
                          }}
                          className="w-full border rounded-xl p-2.5 bg-white min-h-[80px] text-sm resize-none"
                        />
                      </div>

                      {/* ADD NEW IMAGE DIRECTLY IN THIS EDIT FORM */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                          <ImagePlus className="w-3.5 h-3.5 text-blue-600" />
                          <span>إضافة صورة جديدة لهذا المنتج (تُحفظ تلقائياً مع الضغط على زر حفظ التعديلات)</span>
                        </label>
                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-3 bg-white hover:border-blue-400 transition-colors">
                          <Input type="file" name="image" accept="image/*" className="cursor-pointer" />
                          <p className="text-[11px] text-gray-400 mt-1.5 text-center">
                            اختر صورة من جهازك، وسيتم حفظها وإضافتها لمعرض صور المنتج عند الضغط على "حفظ التعديلات" بالأسفل 👇
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer select-none bg-white rounded-xl border p-3">
                        <input type="checkbox" name="isFeatured" value="true"
                          id={`feat-${product.id}`} defaultChecked={product.isFeatured}
                          className="w-4 h-4 accent-green-700" />
                        <span className="text-sm font-medium text-gray-700">منتج مميز ⭐ — يظهر في الصفحة الرئيسية</span>
                      </label>

                      {/* SAVE BUTTON */}
                      <div className="flex gap-2 pt-2">
                        <Button type="submit" size="sm" className="bg-green-700 hover:bg-green-800 text-white flex-1 h-11 rounded-xl font-bold text-sm shadow-sm gap-2">
                          <span>💾 حفظ كافة التعديلات والصورة</span>
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditId(null)} className="h-11 px-6 rounded-xl">
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
