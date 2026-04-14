"use client";

import type React from "react";
import api from "@/lib/axios";
import { setAuthSession } from "@/lib/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Eye, EyeOff, Shield } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}
export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
      setAuthSession(response.data.accessToken, response.data.user.role);
      console.log("Login Success:", response.data);
      router.push(
        response.data.user.role === "admin" ? "/admin" : "/volunteer",
      );
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message ||
            "Login failed! Please try again"
          : "Login failed! Please try again";
      setError(message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo & Tagline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm border border-white/20 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Trinetra</h1>
        <p className="text-muted-foreground text-balance">
          AI-Powered Crowd Management & Public Safety System
        </p>
      </div>

      {/* Card */}
      <Card className="glass-strong shadow-2xl border-white/30">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">
            Sign In
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Access your account securely
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="glass border-white/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="glass border-white/20 focus:border-primary/50 transition-all duration-200 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </form>

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-border/50" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="glass border-white/20 hover:glass-strong transition-all duration-200 bg-transparent"
            >
              <Mail className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              className="glass border-white/20 hover:glass-strong transition-all duration-200 bg-transparent"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Redirect to Sign Up */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Create Account
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
