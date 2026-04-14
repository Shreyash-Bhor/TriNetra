export type AppRole = "admin" | "volunteer";

const ACCESS_TOKEN_KEY = "trinetra_access_token";
const ROLE_KEY = "trinetra_role";

const isBrowser = () => typeof window !== "undefined";

export const roleHomeRoute: Record<AppRole, string> = {
  admin: "/admin",
  volunteer: "/volunteer",
};

export function setAuthSession(accessToken: string, role: AppRole) {
  if (!isBrowser()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearAuthSession() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getCurrentRole(): AppRole | null {
  if (!isBrowser()) return null;

  const role = window.localStorage.getItem(ROLE_KEY);
  return role === "admin" || role === "volunteer" ? role : null;
}

export function getAuthenticatedHomeRoute() {
  const role = getCurrentRole();
  return role ? roleHomeRoute[role] : null;
}
