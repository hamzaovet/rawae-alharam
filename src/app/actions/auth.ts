"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const rawUsername = formData.get("username") as string;
  const password = formData.get("password") as string;

  const username = rawUsername?.trim();

  if (!username || !password) {
    return { error: "يرجى إدخال اسم المستخدم وكلمة المرور" };
  }

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });

  if (!user || !user.isActive) {
    return { error: "بيانات الدخول غير صحيحة أو الحساب موقوف" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "بيانات الدخول غير صحيحة" };
  }

  await createSession(user.id, user.role, user.username);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
