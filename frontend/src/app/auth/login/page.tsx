"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) router.replace("/admin/dashboard");
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data.email, data.password);
      login(response.user, response.token);
      toast.success(`Welcome back, ${response.user.name}!`);
      const redirect = searchParams.get("redirect") ?? "/admin/dashboard";
      router.replace(redirect);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-temple-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-golden w-full max-w-md p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-cinzel font-bold text-saffron">ॐ</span>
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-rust">Admin Login</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Sri Venkata Sai Devasthanam</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="form-label">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="admin@svsdevastanam.org"
              className="form-input"
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="form-input pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={<LogIn className="w-4 h-4" />}
            size="lg"
            className="w-full"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 font-noto mt-6">
          This area is restricted to temple administrators only.
        </p>
      </div>
    </div>
  );
}
