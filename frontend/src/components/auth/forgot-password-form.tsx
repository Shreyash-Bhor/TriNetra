"use client";

import type React from "react";
import { useState } from "react";
import { AxiosError } from "axios";
import { forgotPassword } from "@/lib/passwordResetApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";

export function ForgotPasswordForm({ onCancel }: { onCancel: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await forgotPassword({ username, newPassword });
      setSuccess(response.message || "Password reset successful");
      setNewPassword("");
    } catch (requestError: unknown) {
      const message =
        requestError instanceof AxiosError
          ? (requestError.response?.data as { message?: string })?.message ||
            "Could not reset password"
          : "Could not reset password";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md">
      <form onSubmit={handleResetPassword} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="forgot-username">Username</Label>
          <Input
            id="forgot-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-username"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="forgot-new-password">New Password</Label>
          <PasswordInput
            id="forgot-new-password"
            value={newPassword}
            onChange={setNewPassword}
            show={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onCancel();
              setError("");
              setSuccess("");
            }}
          >
            Back
          </Button>
        </div>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-500">{success}</p>}
    </div>
  );
}
