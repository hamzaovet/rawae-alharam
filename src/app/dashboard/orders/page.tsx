import prisma from "@/lib/prisma";
import { OrdersClient } from "./client";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <OrdersClient orders={orders} />;
}
