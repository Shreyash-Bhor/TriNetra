"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AuthUser, logoutUser } from "@/lib/auth";

interface ProfileMenuProps {
  user: AuthUser;
}

function getInitials(username: string) {
  return username
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-10 w-10 rounded-full border border-white/20 bg-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <Avatar className="size-8 border border-primary/20">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(user.username) || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="sr-only">Toggle profile menu</span>
      </Button>

      {isOpen ? (
        <div className="absolute right-0 top-12 w-64 rounded-2xl border border-white/30 bg-white/85 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-foreground">
                {user.username}
              </p>
            </div>
          </div>

          <div className="my-4 h-px bg-border" />

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Role type</p>
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
              {user.role}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={async () => {
              await logoutUser();
              window.location.href = "/";
            }}
            className="mt-4 w-full justify-center rounded-xl border-white/20 bg-white/50 text-xs hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      ) : null}
    </div>
  );
}
