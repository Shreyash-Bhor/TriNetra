"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/lib/auth";
import { ProfileMenu } from "@/components/navigation/profile-menu";

interface AuthActionsProps {
  user: AuthUser | null;
}

export function AuthActions({ user }: AuthActionsProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          className="rounded-full border border-white/20 bg-white/40 px-4 text-xs transition-all duration-300 hover:scale-105 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="rounded-full px-4 text-xs">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return <ProfileMenu user={user} />;
}
