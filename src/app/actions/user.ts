"use server";

import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function createAdmin(formData: FormData): Promise<void> {
  const session = await verifySession();
  if (session?.role !== "SUPER_ADMIN") redirect("/dashboard");

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password || password.length < 8) return;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashedPassword, role: "ADMIN", isActive: true },
    });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

export async function toggleUserStatus(id: string): Promise<void> {
  const session = await verifySession();
  if (session?.role !== "SUPER_ADMIN") redirect("/dashboard");

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role === "SUPER_ADMIN") return;

    await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error toggling user status:", error);
  }
}

export async function deleteUser(id: string): Promise<void> {
  const session = await verifySession();
  if (session?.role !== "SUPER_ADMIN") redirect("/dashboard");

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role === "SUPER_ADMIN") return;

    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

export async function updateAdminPassword(formData: FormData): Promise<void> {
  const session = await verifySession();
  if (session?.role !== "SUPER_ADMIN") redirect("/dashboard");

  const id = formData.get("id") as string;
  const newPassword = (formData.get("newPassword") as string)?.trim();

  if (!id || !newPassword || newPassword.length < 8) return;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error updating admin password:", error);
  }
}

