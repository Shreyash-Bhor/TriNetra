"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppRole,
  clearAuthSession,
  getAccessToken,
  getCurrentRole,
  roleHomeRoute,
} from "@/lib/auth";

type RoleGuardProps = PropsWithChildren<{
  allowedRoles: AppRole[];
}>;

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const role = getCurrentRole();

    if (!token || !role) {
      clearAuthSession();
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace(roleHomeRoute[role]);
      return;
    }

    setAllowed(true);
  }, [allowedRoles, router]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Validating session...
      </div>
    );
  }

  return <>{children}</>;
}
