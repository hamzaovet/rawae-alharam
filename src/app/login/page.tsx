"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <p className="text-sm text-gray-500">لوحة تحكم روائع الحرم</p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
                {state.error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم المستخدم</label>
              <Input 
                name="username" 
                placeholder="maestro" 
                required 
                dir="ltr"
                className="text-left"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور</label>
              <Input 
                name="password" 
                type="password" 
                required 
                dir="ltr"
                className="text-left"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              دخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
