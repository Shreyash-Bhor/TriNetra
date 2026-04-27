"use client";

import type React from "react";
import api from "@/lib/axios";
import { roleHomeRoute, setAuthSession } from "@/lib/auth";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthBrandHeader } from "@/components/auth/auth-brand-header";
import { PasswordInput } from "@/components/auth/password-input";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();

  const [view, setView] = useState<"login" | "forgot">("login");

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("auth/login", formData);
      const role = response.data.user.role as "admin" | "volunteer";

      setAuthSession(
        response.data.accessToken,
        role,
        response.data.user.username,
      );

      router.push(roleHomeRoute[role]);
    } catch (requestError: unknown) {
      const message =
        requestError instanceof AxiosError
          ? (requestError.response?.data as { message?: string })?.message ||
            "Login failed! Please try again"
          : "Login failed! Please try again";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AuthBrandHeader
        title="Welcome back"
        subtitle="Sign in to access your secure command center"
      />

      <Card className="glass-strong shadow-2xl border-white/30">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">
            {view === "login" ? "Sign In" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {view === "login"
              ? "Use your registered account credentials"
              : "Reset your password securely"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {view === "login" && (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    value={formData.password}
                    onChange={(value) => handleInputChange("password", value)}
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                {error && <p className="text-sm text-red-500">{error}</p>}
              </form>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Don’t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </>
          )}

          {view === "forgot" && (
            <ForgotPasswordForm onCancel={() => setView("login")} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
