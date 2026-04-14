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

type SignUpFormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: "admin" | "volunteer";
  password: string;
  confirmPassword: string;
};

const initialValues: SignUpFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  role: "volunteer",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<SignUpFormData>(initialValues);

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      });

      const role = response.data.user.role as "admin" | "volunteer";
      setAuthSession(response.data.accessToken, role);
      router.push(roleHomeRoute[role]);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof AxiosError
          ? (submitError.response?.data as { message?: string })?.message ||
              "Signup failed"
          : "Signup failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <AuthBrandHeader
        title="Create your account"
        subtitle="Join Trinetra to coordinate safety operations in real-time"
      />

      <Card className="glass-strong shadow-2xl border-white/30">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">
            Sign Up
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Provide accurate details to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="glass border-white/20 focus:border-primary/50 transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="glass border-white/20 focus:border-primary/50 transition-all duration-200"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="glass border-white/20 focus:border-primary/50 transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="glass border-white/20 focus:border-primary/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="glass border-white/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="glass flex h-10 w-full rounded-md border border-white/20 px-3 py-2 text-sm"
              >
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-200"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
