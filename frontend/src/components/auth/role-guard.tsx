"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppRole,
  clearAuthSession,
  getAccessToken,
  getCurrentRole,
  restoreAuthSession,
  roleHomeRoute,
} from "@/lib/auth";

type RoleGuardProps = PropsWithChildren<{
  allowedRoles: AppRole[];
}>;

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      let token = getAccessToken();
      let role = getCurrentRole();

      if (!token || !role) {
        const restored = await restoreAuthSession();
        if (!restored) {
          clearAuthSession();
          router.replace("/login");
          return;
        }

        token = getAccessToken();
        role = getCurrentRole();
      }
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
    };

    validateSession();
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
