"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAccessToken,
  getAuthenticatedHomeRoute,
  restoreAuthSession,
} from "@/lib/auth";

export function AuthRedirect({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      let token = getAccessToken();
      let homeRoute = getAuthenticatedHomeRoute();

      if (!token || !homeRoute) {
        const restored = await restoreAuthSession();
        if (!restored) return;

        token = getAccessToken();
        homeRoute = getAuthenticatedHomeRoute();
      }

      if (token && homeRoute) {
        router.replace(homeRoute);
      }
    };

    redirectIfAuthenticated();
  }, [router]);

  return <>{children}</>;
}
