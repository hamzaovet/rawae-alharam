"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  customer: string;
  phone: string;
  address: string;
  notes?: string;
  total: number;
  items: { productId: string; title: string; price: number; quantity: number }[];
}) {
  if (!data.customer || !data.phone || !data.address || data.items.length === 0) {
    return { error: "يرجى استكمال جميع البيانات المطلوبة والمنتجات" };
  }

  try {
    const order = await prisma.order.create({
      data: {
        customer: data.customer,
        phone: data.phone,
        address: data.address,
        notes: data.notes || "",
        total: data.total,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى" };
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating order status:", error);
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });
    await prisma.order.delete({
      where: { id: orderId },
    });
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}
