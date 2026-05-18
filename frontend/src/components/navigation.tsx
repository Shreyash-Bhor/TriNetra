"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import {
  AppRole,
  AUTH_CHANGE_EVENT,
  AuthUser,
  clearAuthSession,
  getAuthUser,
} from "@/lib/auth";
import { AuthActions } from "@/components/navigation/auth-actions";

const navLinksByRole: Record<AppRole, { label: string; href: string }[]> = {
  admin: [
    { label: "Home", href: "/" },
    { label: "Admin", href: "/admin" },
  ],
  volunteer: [
    { label: "Home", href: "/" },
    { label: "Volunteer", href: "/volunteer" },
  ],
};

const defaultNavLinks = [{ label: "Home", href: "/" }];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const syncAuth = () => setUser(getAuthUser());

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
    };
  }, []);

  const navLinks = useMemo(() => {
    if (!user) return defaultNavLinks;
    return navLinksByRole[user.role];
  }, [user]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/30 bg-white/45 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-black/25">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="bg-gradient-to-r from-primary via-sky-400 to-violet-400 bg-clip-text text-2xl font-bold text-transparent transition-transform duration-300 hover:scale-[1.03]"
        >
          Trinetra
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 text-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-white/35 hover:text-foreground dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="rounded-full border border-white/20 bg-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="hidden md:block">
            <AuthActions user={user} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-full border border-white/20 bg-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/60 md:hidden dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-white/20 transition-all duration-300 md:hidden dark:border-white/10 ${
          isOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 my-3 space-y-1 rounded-2xl border border-white/30 bg-white/45 p-2 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-black/25">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-xl px-3 py-2 text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-primary/15 text-foreground"
                    : "text-foreground/75 hover:bg-white/40 hover:text-foreground dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-2 border-t border-white/20 pt-2 dark:border-white/10">
            {user ? (
              <>
                <div className="rounded-xl bg-white/45 px-3 py-2 text-xs dark:bg-white/5">
                  <p className="text-muted-foreground">Signed in as</p>
                  <p className="font-semibold">{user.username}</p>
                  <p className="mt-1 text-muted-foreground capitalize">
                    Role: {user.role}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    clearAuthSession();
                    window.location.href = "/login";
                  }}
                  className="mt-2 w-full justify-start rounded-xl"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2 px-1 pb-1 pt-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
