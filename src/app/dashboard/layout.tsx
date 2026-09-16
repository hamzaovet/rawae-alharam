import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { DashboardShell } from "./DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, pendingOrders] = await Promise.all([
    verifySession(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <DashboardShell session={session} pendingOrders={pendingOrders}>
      {children}
    </DashboardShell>
  );
}
