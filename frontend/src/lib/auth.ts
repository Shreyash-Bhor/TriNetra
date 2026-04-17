export type AppRole = "admin" | "volunteer";

export interface AuthUser {
  role: AppRole;
  username: string;
}

const ACCESS_TOKEN_KEY = "trinetra_access_token";
const ROLE_KEY = "trinetra_role";
const USERNAME_KEY = "trinetra_username";
export const AUTH_CHANGE_EVENT = "trinetra-auth-changed";

const isBrowser = () => typeof window !== "undefined";

export const roleHomeRoute: Record<AppRole, string> = {
  admin: "/admin",
  volunteer: "/volunteer",
};

const notifyAuthChanged = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export function setAuthSession(
  accessToken: string,
  role: AppRole,
  username?: string,
) {
  if (!isBrowser()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(ROLE_KEY, role);

  if (username && username.trim()) {
    window.localStorage.setItem(USERNAME_KEY, username.trim());
  }

  notifyAuthChanged();
}

export function clearAuthSession() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(USERNAME_KEY);

  notifyAuthChanged();
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

export function getCurrentUsername(): string | null {
  if (!isBrowser()) return null;

  const username = window.localStorage.getItem(USERNAME_KEY);
  return username ? username : null;
}

export function getAuthUser(): AuthUser | null {
  const role = getCurrentRole();
  const token = getAccessToken();

  if (!role || !token) return null;

  return {
    role,
    username: getCurrentUsername() ?? "User",
  };
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getCurrentRole());
}

export function getAuthenticatedHomeRoute() {
  const role = getCurrentRole();
  return role ? roleHomeRoute[role] : null;
}
