"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppRole, getAccessToken, getCurrentRole } from "@/lib/auth";

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
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace(role === "admin" ? "/admin" : "/volunteer");
      return;
    }

    setAllowed(true);
  }, [allowedRoles, router]);

  if (!allowed) return null;
  return <>{children}</>;
}
