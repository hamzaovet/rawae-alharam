"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  Palette, 
  Users, 
  Tag, 
  LogOut, 
  ShoppingCart, 
  Menu, 
  X,
  ExternalLink
} from "lucide-react";
import { logout } from "@/app/actions/auth";

type NavItem = {
  href: string;
  icon: any;
  label: string;
  badge?: number;
};

type Session = {
  userId: string;
  role: string;
  username: string;
} | null;

export function DashboardShell({
  children,
  session,
  pendingOrders,
}: {
  children: React.ReactNode;
  session: Session;
  pendingOrders: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: "الرئيسية" },
    { href: "/dashboard/orders", icon: ShoppingCart, label: "الطلبات", badge: pendingOrders },
    { href: "/dashboard/categories", icon: FolderTree, label: "الأقسام" },
    { href: "/dashboard/products", icon: ShoppingBag, label: "المنتجات" },
    { href: "/dashboard/deals", icon: Tag, label: "عروض الأسبوع" },
    { href: "/dashboard/themes", icon: Palette, label: "مكتبة الثيمات" },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map(({ href, icon: Icon, label, badge }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={`flex items-center justify-between p-3 rounded-xl transition-all text-sm font-medium ${
              isActive
                ? "bg-green-700 text-white shadow-xs font-bold"
                : "text-gray-700 hover:bg-green-50 hover:text-green-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
              <span>{label}</span>
            </div>
            {badge !== undefined && badge > 0 && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isActive ? "bg-white text-green-800" : "bg-amber-500 text-white animate-pulse"
              }`}>
                {badge}
              </span>
            )}
          </Link>
        );
      })}

      {session?.role === "SUPER_ADMIN" && (
        <Link
          href="/dashboard/users"
          onClick={onClick}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${
            pathname === "/dashboard/users"
              ? "bg-purple-700 text-white shadow-xs font-bold"
              : "text-gray-700 hover:bg-purple-50 hover:text-purple-800"
          }`}
        >
          <Users className={`w-5 h-5 ${pathname === "/dashboard/users" ? "text-white" : "text-gray-500"}`} />
          <span>إدارة المديرين</span>
        </Link>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white border-l border-gray-200 flex-col shadow-xs flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-green-800 to-green-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">لوحة التحكم</h2>
            <Link
              href="/"
              target="_blank"
              title="زيارة المتجر"
              className="text-green-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-green-200 text-xs mt-1">روائع الحرم · إدارة المتجر</p>
          {session && (
            <div className="mt-3 pt-2.5 border-t border-green-600/50 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs">
                {session.role === "SUPER_ADMIN" ? "🔑" : "👤"}
              </span>
              <span className="text-xs text-green-100 font-semibold truncate">
                {session.username}
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center w-full gap-3 p-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b bg-gradient-to-b from-green-800 to-green-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">لوحة التحكم</h2>
                <p className="text-green-200 text-xs mt-0.5">روائع الحرم</p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              <NavLinks onClick={() => setMobileOpen(false)} />
            </nav>

            <div className="p-4 border-t space-y-2">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full p-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>زيارة المتجر العام</span>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full gap-2 p-2.5 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-xs font-bold border border-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE TOP HEADER */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="فتح القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="font-extrabold text-sm text-gray-900 block leading-tight">روائع الحرم</span>
              <span className="text-[10px] text-gray-400">لوحة التحكم</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingOrders > 0 && (
              <Link
                href="/dashboard/orders"
                className="bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-amber-700" />
                <span>{pendingOrders}</span>
              </Link>
            )}
            <Link
              href="/"
              target="_blank"
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-700"
              title="زيارة المتجر"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
