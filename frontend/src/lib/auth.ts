export type AppRole = "admin" | "volunteer";

export interface AuthUser {
  role: AppRole;
  username: string;
  location?: "Ramkund" | "Kalaram_Temple" | "Panchavati_Market";
}

const ACCESS_TOKEN_KEY = "trinetra_access_token";
const ROLE_KEY = "trinetra_role";
const USERNAME_KEY = "trinetra_username";
const LOCATION_KEY = "trinetra_location";
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
  location?: "Ramkund" | "Kalaram_Temple" | "Panchavati_Market",
) {
  if (!isBrowser()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(ROLE_KEY, role);

  if (username && username.trim()) {
    window.localStorage.setItem(USERNAME_KEY, username.trim());
  }
  if (location) {
    window.localStorage.setItem(LOCATION_KEY, location);
  }

  notifyAuthChanged();
}

export function clearAuthSession() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(USERNAME_KEY);
  window.localStorage.removeItem(LOCATION_KEY);
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
export function getCurrentLocation(): AuthUser["location"] | null {
  if (!isBrowser()) return null;

  const location = window.localStorage.getItem(LOCATION_KEY);
  if (
    location === "Ramkund" ||
    location === "Kalaram_Temple" ||
    location === "Panchavati_Market"
  ) {
    return location;
  }

  return null;
}
export function getAuthUser(): AuthUser | null {
  const role = getCurrentRole();
  const token = getAccessToken();

  if (!role || !token) return null;

  return {
    role,
    username: getCurrentUsername() ?? "User",
    location: getCurrentLocation() ?? undefined,
  };
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getCurrentRole());
}

export function getAuthenticatedHomeRoute() {
  const role = getCurrentRole();
  return role ? roleHomeRoute[role] : null;
}
export async function logoutUser() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

  try {
    await window.fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
  } finally {
    clearAuthSession();
  }
}
type JwtPayload = {
  role?: AppRole;
  email?: string;
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = JSON.parse(window.atob(payload)) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

export async function restoreAuthSession(): Promise<boolean> {
  if (!isBrowser()) return false;

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";
    const response = await window.fetch(`${apiBaseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      clearAuthSession();
      return false;
    }

    const data = (await response.json()) as {
      accessToken?: string;
      user?: { location?: AuthUser["location"] };
    };
    const accessToken = data.accessToken;
    if (!accessToken) {
      clearAuthSession();
      return false;
    }

    const payload = parseJwtPayload(accessToken);
    const role = payload?.role;
    if (role !== "admin" && role !== "volunteer") {
      clearAuthSession();
      return false;
    }

    const fallbackUsername = payload?.email?.split("@")[0];
    setAuthSession(accessToken, role, fallbackUsername, data.user?.location);
    return true;
  } catch {
    clearAuthSession();
    return false;
  }
}
