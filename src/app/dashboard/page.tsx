import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree, ShoppingBag, ShoppingCart, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const [productsCount, categoriesCount, ordersCount, pendingOrdersCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">ملخص النظام</h1>
        <p className="text-gray-400 text-sm mt-1">نظرة عامة على حالة المتجر والعمليات الحالية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/orders" className="group">
          <Card className="rounded-2xl hover:border-green-400 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">الطلبات الواردة</CardTitle>
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-700 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-gray-900">{ordersCount}</div>
                {pendingOrdersCount > 0 ? (
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {pendingOrdersCount} قيد المراجعة
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-green-700">
                    عرض الكل <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/products" className="group">
          <Card className="rounded-2xl hover:border-green-400 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">إجمالي المنتجات</CardTitle>
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-gray-900">{productsCount}</div>
                <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-green-700">
                  إدارة المنتجات <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/categories" className="group">
          <Card className="rounded-2xl hover:border-green-400 hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">الأقسام المتاحة</CardTitle>
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
                <FolderTree className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-gray-900">{categoriesCount}</div>
                <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-green-700">
                  إدارة الأقسام <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
