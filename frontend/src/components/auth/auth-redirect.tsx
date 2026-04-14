"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getAuthenticatedHomeRoute } from "@/lib/auth";

export function AuthRedirect({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    const homeRoute = getAuthenticatedHomeRoute();

    if (token && homeRoute) {
      router.replace(homeRoute);
    }
  }, [router]);

  return <>{children}</>;
}
