"use client";

import { useState } from "react";
import { updateOrderStatus, deleteOrder } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Search, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Trash2,
  Receipt
} from "lucide-react";

export type OrderItemType = {
  id: string;
  orderId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

export type OrderType = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  notes: string | null;
  total: number;
  status: string;
  items: OrderItemType[];
  createdAt: Date;
  updatedAt: Date;
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  PENDING: { label: "قيد المراجعة", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
  SHIPPED: { label: "تم الشحن", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: Truck },
  DELIVERED: { label: "مكتمل والتسليم", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
  CANCELLED: { label: "ملغي", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
};

export function OrdersClient({ orders }: { orders: OrderType[] }) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQ, setSearchQ] = useState<string>("");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchStatus = filterStatus === "ALL" || order.status === filterStatus;
    const matchSearch =
      searchQ.trim() === "" ||
      order.customer.toLowerCase().includes(searchQ.toLowerCase()) ||
      order.phone.includes(searchQ) ||
      order.id.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getWhatsAppLink = (order: OrderType) => {
    // Clean phone number for Egypt (replace leading 0 with 20)
    let cleanPhone = order.phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "2" + cleanPhone;
    } else if (!cleanPhone.startsWith("20") && cleanPhone.length === 10) {
      cleanPhone = "20" + cleanPhone;
    }

    const itemsSummary = order.items
      .map((item) => `- ${item.title} (عدد ${item.quantity} × ${item.price} ج.م)`)
      .join("\n");

    const message = `السلام عليكم ورحمة الله وبركاته،
أهلاً بك يا أستاذ ${order.customer} 🌸
نتواصل معك من متجر *روائع الحرم* لتأكيد طلبكم رقم (#${order.id.slice(0, 8)}):

المنتجات:
${itemsSummary}

المبلغ الإجمالي: ${order.total} ج.م (الدفع عند الاستلام)
عنوان التوصيل: ${order.address}

هل البيانات صحيحة لتجهيز الشحن لحضرتك؟`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div dir="rtl" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">إدارة الطلبات</h1>
          <p className="text-gray-400 text-sm mt-1">متابعة وتأكيد طلبات العملاء وتحديث حالات الشحن والتوصيل</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm flex items-center gap-1.5">
            <Package className="w-4 h-4 text-green-700" />
            <span>إجمالي الطلبات: {orders.length}</span>
          </div>
          {statusCounts.PENDING > 0 && (
            <div className="bg-amber-100 border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm animate-pulse flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{statusCounts.PENDING} طلب جديد قيد المراجعة</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "الكل", count: statusCounts.ALL },
              { id: "PENDING", label: "قيد المراجعة", count: statusCounts.PENDING },
              { id: "SHIPPED", label: "تم الشحن", count: statusCounts.SHIPPED },
              { id: "DELIVERED", label: "مكتمل", count: statusCounts.DELIVERED },
              { id: "CANCELLED", label: "ملغي", count: statusCounts.CANCELLED },
            ].map((tab) => {
              const active = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-green-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث بالاسم، الهاتف، أو رقم الطلب..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="pr-9 h-9 text-xs rounded-xl bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border p-16 text-center text-gray-400">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-bold text-base text-gray-700">لا توجد طلبات مطابقة</p>
            <p className="text-xs text-gray-400 mt-1">جرّب تغيير حالة الفلتر أو البحث بكلمات أخرى</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
            const StatusIcon = statusConfig.icon;
            const isExpanded = !!expandedOrders[order.id];

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center font-bold text-green-700 shadow-xs">
                      #{order.id.slice(0, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">{order.customer}</span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleString("ar-EG", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[11px]">كود: {order.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Status Control & Total */}
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-left">
                      <span className="text-xs text-gray-400 block">المبلغ المطلوب</span>
                      <span className="text-lg font-extrabold text-green-700">{order.total} ج.م</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Direct WhatsApp button */}
                      <a
                        href={getWhatsAppLink(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3 bg-[#25d366] hover:bg-[#1ebd5b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
                        title="محادثة واتساب سريعة لتأكيد الطلب"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">واتساب العميل</span>
                      </a>

                      {/* Expand Details Toggle */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleExpand(order.id)}
                        className="h-9 rounded-xl text-xs text-gray-600 gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <span>إخفاء التفاصيل</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>التفاصيل ({order.items.length})</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Customer Details Strip */}
                <div className="px-5 py-3 text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b bg-white">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400">الهاتف:</span>
                    <a href={`tel:${order.phone}`} className="font-bold text-gray-800 hover:text-green-700 dir-ltr">
                      {order.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400">العنوان:</span>
                    <span className="font-medium text-gray-800 line-clamp-1">{order.address}</span>
                  </div>
                  {order.notes && (
                    <div className="sm:col-span-3 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-amber-900">
                      <span className="font-bold ml-1">ملاحظة العميل:</span>
                      {order.notes}
                    </div>
                  )}
                </div>

                {/* Expanded Details: Items & Actions */}
                {isExpanded && (
                  <div className="p-5 bg-gray-50/80 space-y-4 animate-in fade-in duration-200">
                    <h4 className="text-xs font-bold text-gray-700">المنتجات المطلوبة في هذا الطلب:</h4>
                    <div className="bg-white rounded-xl border divide-y overflow-hidden shadow-2xs">
                      {order.items.map((item) => (
                        <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                              {item.quantity}×
                            </span>
                            <span className="font-semibold text-gray-800">{item.title}</span>
                          </div>
                          <div className="text-left font-bold text-gray-700">
                            {item.price * item.quantity} ج.م
                            <span className="text-[10px] text-gray-400 block font-normal">
                              ({item.price} ج.م للقطعة)
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-gray-50 flex justify-between items-center text-xs font-extrabold text-gray-900">
                        <span>إجمالي الفاتورة:</span>
                        <span className="text-sm text-green-700">{order.total} ج.م</span>
                      </div>
                    </div>

                    {/* Status Changer Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-600">تغيير حالة الطلب:</span>
                        {[
                          { status: "PENDING", label: "قيد المراجعة", btnClass: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300" },
                          { status: "SHIPPED", label: "تم الشحن", btnClass: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" },
                          { status: "DELIVERED", label: "مكتمل", btnClass: "hover:bg-green-50 hover:text-green-700 hover:border-green-300" },
                          { status: "CANCELLED", label: "إلغاء الطلب", btnClass: "hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-red-600" },
                        ].map((btn) => (
                          <form key={btn.status} action={updateOrderStatus.bind(null, order.id, btn.status)}>
                            <Button
                              type="submit"
                              size="sm"
                              variant={order.status === btn.status ? "default" : "outline"}
                              className={`h-8 text-xs rounded-xl ${
                                order.status === btn.status
                                  ? "bg-gray-800 text-white font-bold"
                                  : btn.btnClass
                              }`}
                              disabled={order.status === btn.status}
                            >
                              {btn.label}
                            </Button>
                          </form>
                        ))}
                      </div>

                      {/* Delete Order Action */}
                      <form action={deleteOrder.bind(null, order.id)}>
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs rounded-xl text-red-600 border-red-200 hover:bg-red-50 gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف السجل</span>
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
