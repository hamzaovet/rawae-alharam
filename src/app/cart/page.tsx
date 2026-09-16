"use client";

import { useCart } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import { Trash2, Plus, Minus, ArrowRight, CheckCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createOrder } from "@/app/actions/order";

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, total, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ id: string; customer: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.customer || !formData.phone || !formData.address) {
      setErrorMsg("يرجى ملء جميع الحقول الإلزامية (الاسم، الهاتف، العنوان)");
      return;
    }

    setLoading(true);

    const res = await createOrder({
      customer: formData.customer,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      total,
      items: items.map((i) => ({
        productId: i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    setLoading(false);

    if (res.success && res.orderId) {
      const orderInfo = { id: res.orderId, customer: formData.customer };
      setSuccessOrder(orderInfo);
      clearCart();
    } else {
      setErrorMsg(res.error || "حدث خطأ أثناء إتمام الطلب");
    }
  };

  const generateWhatsAppUrl = () => {
    const lines = [
      `السلام عليكم، قمت بعمل طلب جديد من موقع روائع الحرم:`,
      `رقم الطلب: ${successOrder?.id?.slice(0, 8) || ""}`,
      `الاسم: ${formData.customer}`,
      `الهاتف: ${formData.phone}`,
      `العنوان: ${formData.address}`,
      formData.notes ? `ملاحظات: ${formData.notes}` : "",
      `إجمالي المبلغ: ${total} ج.م`,
    ].filter(Boolean);

    return `https://wa.me/201127968425?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-gray-500 hover:text-[var(--theme-primary)] flex items-center gap-1 text-sm">
            <ArrowRight className="w-4 h-4" /> العودة للتسوق
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--theme-primary)" }}>
            سلة المشتريات ({count})
          </h1>
        </div>

        {successOrder ? (
          <div className="bg-white rounded-[var(--theme-radius)] p-8 max-w-2xl mx-auto text-center border shadow-sm space-y-5" style={{ borderColor: "var(--theme-secondary)" }}>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-green-800">تم تأكيد طلبك بنجاح!</h2>
            <p className="text-gray-600">
              شكراً لك يا <strong>{successOrder.customer}</strong>، تم تسجيل طلبك برقم <code>{successOrder.id.slice(0, 8)}</code> وسيتواصل معك فريق روائع الحرم لتأكيد التوصيل.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-[var(--theme-radius)] font-bold text-white flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebd5b] transition-colors"
              >
                <span>💬</span> إرسال تفاصيل الطلب عبر واتساب
              </a>
              <Link
                href="/products"
                className="px-6 py-3 rounded-[var(--theme-radius)] font-bold border hover:bg-gray-50 transition-colors"
                style={{ borderColor: "var(--theme-primary)", color: "var(--theme-primary)" }}
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white/70 rounded-[var(--theme-radius)] border p-8 max-w-xl mx-auto" style={{ borderColor: "var(--theme-secondary)" }}>
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">سلة مشترياتك فارغة</h2>
            <p className="text-gray-500 mb-6">استكشف تشكيلتنا الواسعة من العبايات والمصاحف والعطور والسبح الفاخرة</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-[var(--theme-radius)] text-white font-bold transition-transform hover:scale-105"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              تصفح المنتجات الآن
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-[var(--theme-radius)] p-5 border shadow-sm" style={{ borderColor: "var(--theme-secondary)" }}>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base line-clamp-1">{item.title}</h3>
                        <p className="text-sm font-semibold mt-1" style={{ color: "var(--theme-primary)" }}>
                          {item.price} ج.م
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border rounded-lg px-2 py-1 bg-gray-50">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="text-gray-600 hover:text-black p-1"
                          title="تقليل"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="text-gray-600 hover:text-black p-1"
                          title="زيادة"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-left font-bold min-w-[80px]">
                        {item.price * item.quantity} ج.م
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/60 p-4 rounded-[var(--theme-radius)] border" style={{ borderColor: "var(--theme-secondary)" }}>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 underline"
                >
                  تفريغ السلة بالكامل
                </button>
                <div className="text-sm text-gray-500">
                  شحن متاح لجميع محافظات مصر
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[var(--theme-radius)] p-6 border shadow-sm sticky top-24 space-y-5" style={{ borderColor: "var(--theme-secondary)" }}>
                <h2 className="text-xl font-bold border-b pb-3">ملخص وإتمام الطلب</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">إجمالي المنتجات ({count}):</span>
                    <span className="font-semibold">{total} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">مصاريف الشحن:</span>
                    <span className="text-green-600 font-semibold">تُحدد عند التأكيد</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold" style={{ color: "var(--theme-primary)" }}>
                    <span>المجموع الإجمالي:</span>
                    <span>{total} ج.م</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">الاسم بالكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمد"
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">رقم الهاتف (متاح عليه واتساب) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="مثال: 01012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">عنوان التوصيل بالتفصيل *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="المحافظة - المنطقة - الشارع - رقم العقار"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">ملاحظات إضافية (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مقاس معين، توقيت التسليم..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-[var(--theme-radius)] text-white font-bold text-base transition-transform hover:scale-[1.02] shadow disabled:opacity-50"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  >
                    {loading ? "جاري تأكيد الطلب..." : "تأكيد الطلب الآن (الدفع عند الاستلام)"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
