import prisma from "@/lib/prisma";
import { activateTheme, deleteTheme } from "@/app/actions/theme";
import { Button } from "@/components/ui/button";

const THEME_PREVIEWS = [
  {
    name: "Spiritual",
    nameAr: "الثيم الروحاني",
    description: "طابع روحاني دافئ بالأخضر الزمردي والذهبي",
    bg: "#fffbeb",
    primary: "#15803d",
    secondary: "#eab308",
    text: "#1c1917",
    accent: "#d97706",
    card: "#fef9c3",
    radius: "12px",
    preview: ["bg-amber-50", "text-green-700", "border-yellow-400"],
  },
  {
    name: "Royal",
    nameAr: "الثيم الملكي",
    description: "فخامة الملوك بالخلفية الداكنة والذهبي اللامع",
    bg: "#1c1917",
    primary: "#d4af37",
    secondary: "#92400e",
    text: "#fef3c7",
    accent: "#b45309",
    card: "#292524",
    radius: "4px",
    preview: ["bg-stone-900", "text-yellow-300", "border-yellow-600"],
  },
  {
    name: "Modern",
    nameAr: "الثيم العصري",
    description: "نظيف وعصري بالأزرق والأبيض الناصع",
    bg: "#f8fafc",
    primary: "#1d4ed8",
    secondary: "#0ea5e9",
    text: "#0f172a",
    accent: "#6366f1",
    card: "#ffffff",
    radius: "8px",
    preview: ["bg-slate-50", "text-blue-700", "border-sky-400"],
  },
  {
    name: "Classic",
    nameAr: "الثيم الكلاسيكي",
    description: "أصالة وعراقة بالبيج الدافئ والبني الغامق",
    bg: "#fdf8f0",
    primary: "#78350f",
    secondary: "#a16207",
    text: "#292524",
    accent: "#92400e",
    card: "#fef9f0",
    radius: "2px",
    preview: ["bg-amber-50", "text-amber-900", "border-amber-700"],
  },
];

export default async function ThemesPage() {
  const dbThemes = await prisma.themeSetting.findMany({ orderBy: { createdAt: "asc" } });
  const activeTheme = dbThemes.find((t) => t.isActive);

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold">مكتبة الثيمات</h1>
        <p className="text-gray-500 mt-1">اختر الثيم الذي يناسب هوية متجرك — يُطبّق فوراً على الواجهة الأمامية</p>
      </div>

      {activeTheme && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-green-800">الثيم المفعّل الآن: {activeTheme.nameAr}</p>
            <p className="text-sm text-green-600">الموقع يعرض هذا الثيم للزوار حالياً</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEME_PREVIEWS.map((preview) => {
          const dbTheme = dbThemes.find((t) => t.name === preview.name);
          const isActive = dbTheme?.isActive ?? false;

          return (
            <div
              key={preview.name}
              className={`rounded-xl border-2 overflow-hidden shadow-sm transition-all ${
                isActive ? "border-green-500 shadow-green-100 shadow-lg" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* Live Preview */}
              <div
                className="p-5 relative"
                style={{ backgroundColor: preview.bg, color: preview.text, fontFamily: "Cairo, sans-serif" }}
              >
                {isActive && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    مفعّل ✓
                  </span>
                )}
                {/* Mock Navbar */}
                <div
                  className="rounded-lg px-4 py-2 mb-3 flex justify-between items-center text-sm font-bold"
                  style={{ backgroundColor: preview.primary, color: "#fff", borderRadius: preview.radius }}
                >
                  <span>روائع الحرم</span>
                  <div className="flex gap-3 text-xs opacity-80">
                    <span>الرئيسية</span><span>المنتجات</span><span>تواصل</span>
                  </div>
                </div>
                {/* Mock Hero */}
                <div
                  className="rounded-lg p-4 mb-3 text-center"
                  style={{ backgroundColor: preview.card, border: `2px solid ${preview.secondary}`, borderRadius: preview.radius }}
                >
                  <p className="font-bold text-lg" style={{ color: preview.primary }}>وجهتك الروحانية</p>
                  <p className="text-xs mt-1 opacity-70">أجود العبايات والمصاحف والعطور</p>
                  <div
                    className="mt-2 inline-block px-4 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: preview.accent, borderRadius: preview.radius }}
                  >
                    تسوق الآن
                  </div>
                </div>
                {/* Mock Products */}
                <div className="grid grid-cols-3 gap-2">
                  {["عباءة", "مصحف", "عطور"].map((item) => (
                    <div
                      key={item}
                      className="p-2 text-center text-xs font-medium"
                      style={{ backgroundColor: preview.card, borderRadius: preview.radius, border: `1px solid ${preview.secondary}40` }}
                    >
                      <div className="text-lg mb-1">🛍️</div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Info + Actions */}
              <div className="bg-white border-t p-4">
                <h3 className="font-bold text-lg">{preview.nameAr}</h3>
                <p className="text-sm text-gray-500 mb-3">{preview.description}</p>
                <div className="flex gap-2 items-center mb-3">
                  {[preview.primary, preview.secondary, preview.accent, preview.bg].map((c, i) => (
                    <div
                      key={i}
                      title={c}
                      className="w-6 h-6 rounded-full border shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <span className="text-xs text-gray-400 mr-1">الألوان</span>
                </div>
                {dbTheme ? (
                  <div className="flex gap-2">
                    {!isActive && (
                      <form action={activateTheme.bind(null, dbTheme.id)} className="flex-1">
                        <Button type="submit" className="w-full" style={{ backgroundColor: preview.primary }}>
                          تفعيل هذا الثيم
                        </Button>
                      </form>
                    )}
                    {isActive && (
                      <div className="flex-1 text-center text-green-600 font-bold text-sm py-2">
                        ✅ الثيم الحالي للموقع
                      </div>
                    )}
                    {!isActive && (
                      <form action={deleteTheme.bind(null, dbTheme.id)}>
                        <Button type="submit" variant="outline" size="sm" className="text-red-500 border-red-200">
                          حذف
                        </Button>
                      </form>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">لم يُضف هذا الثيم بعد — قم بتشغيل seed أولاً</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
