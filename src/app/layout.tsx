import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import prisma from "@/lib/prisma";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "روائع الحرم | Rawae Al-Haram",
  description: "وجهتك الأولى للملابس الإسلامية الفاخرة، المصاحف، العطور، والهدايا الروحانية",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let theme = null;
  try {
    theme = await prisma.themeSetting.findFirst({ where: { isActive: true } });
  } catch {}

  const cssVars = theme ? `
    --theme-primary: ${theme.primaryColor};
    --theme-secondary: ${theme.secondaryColor};
    --theme-bg: ${theme.bgColor};
    --theme-text: ${theme.textColor};
    --theme-accent: ${theme.accentColor};
    --theme-radius: ${theme.borderRadius};
  ` : `
    --theme-primary: #15803d;
    --theme-secondary: #eab308;
    --theme-bg: #fffbeb;
    --theme-text: #1c1917;
    --theme-accent: #d97706;
    --theme-radius: 0.75rem;
  `;

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning style={{ ["--font-family" as string]: theme?.fontFamily || "Cairo" }}>
      <head>
        <style>{`
          :root { ${cssVars} }
          body { background-color: var(--theme-bg); color: var(--theme-text); }
        `}</style>
      </head>
      <body suppressHydrationWarning className={`${cairo.variable} font-[family-name:var(--font-cairo)] antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
