import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdmin, toggleUserStatus, deleteUser, updateAdminPassword } from "@/app/actions/user";

export default async function UsersPage() {
  const session = await verifySession();
  if (session?.role !== "SUPER_ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المديرين</h1>
          <p className="text-gray-500 text-sm mt-1">إضافة وإدارة حسابات المديرين</p>
        </div>
      </div>

      {/* Add Admin Form */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">➕ إضافة مدير جديد</h2>
        <form action={createAdmin} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
            <Input name="username" placeholder="مثال: manager2025" required />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium mb-1">كلمة المرور</label>
            <Input name="password" type="password" placeholder="8 أحرف على الأقل" required />
          </div>
          <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
            إنشاء الحساب
          </Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-right">اسم المستخدم</TableHead>
              <TableHead className="text-right">الصلاحية</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium" dir="ltr">{user.username}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                    {user.role === "SUPER_ADMIN" ? "🔑 سوبر أدمن" : "👤 مدير"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {user.isActive ? "✅ نشط" : "🚫 موقوف"}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                </TableCell>
                <TableCell>
                  {user.role !== "SUPER_ADMIN" && (
                    <div className="flex gap-2 items-center">
                      <form action={toggleUserStatus.bind(null, user.id)}>
                        <Button type="submit" variant="outline" size="sm"
                          className={user.isActive ? "text-orange-600 border-orange-200 hover:bg-orange-50" : "text-green-600 border-green-200 hover:bg-green-50"}>
                          {user.isActive ? "إيقاف" : "تفعيل"}
                        </Button>
                      </form>
                      <form action={deleteUser.bind(null, user.id)}>
                        <Button type="submit" variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          حذف
                        </Button>
                      </form>
                      <details className="relative">
                        <summary className="cursor-pointer px-2.5 py-1 text-xs border rounded-md text-blue-600 border-blue-200 hover:bg-blue-50 list-none select-none">
                          🔑 تغيير كلمة المرور
                        </summary>
                        <div className="absolute left-0 top-full mt-2 bg-white border p-3 rounded-xl shadow-xl z-30 w-64 text-right">
                          <form action={updateAdminPassword} className="space-y-2">
                            <input type="hidden" name="id" value={user.id} />
                            <p className="text-xs font-bold text-gray-700">كلمة المرور الجديدة لـ {user.username}:</p>
                            <Input name="newPassword" type="password" placeholder="8 أحرف على الأقل" required minLength={8} className="h-8 text-xs text-left" dir="ltr" />
                            <Button type="submit" size="sm" className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                              تحديث
                            </Button>
                          </form>
                        </div>
                      </details>
                    </div>
                  )}
                  {user.role === "SUPER_ADMIN" && (
                    <span className="text-xs text-gray-400">محمي</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
