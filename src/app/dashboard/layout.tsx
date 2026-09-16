import Link from "next/link";
import { LayoutDashboard, ShoppingBag, FolderTree, Palette, Users, Tag, LogOut, ShoppingCart } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, pendingOrders] = await Promise.all([
    verifySession(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "الرئيسية" },
    { href: "/dashboard/orders", icon: ShoppingCart, label: "الطلبات", badge: pendingOrders },
    { href: "/dashboard/categories", icon: FolderTree, label: "الأقسام" },
    { href: "/dashboard/products", icon: ShoppingBag, label: "المنتجات" },
    { href: "/dashboard/deals", icon: Tag, label: "عروض الأسبوع" },
    { href: "/dashboard/themes", icon: Palette, label: "مكتبة الثيمات" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-green-800 to-green-700">
          <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
          <p className="text-green-200 text-sm mt-1">روائع الحرم</p>
          {session && (
            <p className="text-xs text-green-300 mt-2">
              {session.role === "SUPER_ADMIN" ? "🔑" : "👤"} {session.username}
            </p>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 hover:text-green-800 transition-colors text-gray-700"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{label}</span>
              </div>
              {badge !== undefined && badge > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                  {badge}
                </span>
              )}
            </Link>
          ))}
          {session?.role === "SUPER_ADMIN" && (
            <Link
              href="/dashboard/users"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 hover:text-purple-800 transition-colors text-gray-700"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium text-sm">إدارة المديرين</span>
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center w-full gap-3 p-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
