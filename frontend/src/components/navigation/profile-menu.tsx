"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, MapPin, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AuthUser,
  getCurrentLocation,
  logoutUser,
  setCurrentLocation,
} from "@/lib/auth";
import {
  locationLabelMap,
  updateVolunteerLocation,
  volunteerLocationOptions,
  VolunteerLocation,
} from "@/lib/volunteerLocation";
import { publishRealtimeUpdate } from "@/lib/realtime";

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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState<VolunteerLocation | null>(() => {
    const resolvedLocation = user.location ?? getCurrentLocation();
    return resolvedLocation ?? null;
  });
  const [selectedLocation, setSelectedLocation] = useState<VolunteerLocation>(
    user.location ?? volunteerLocationOptions[0],
  );
  const [locationMessage, setLocationMessage] = useState("");
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
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

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
    setLocationMessage("");
  };

  return (
    <>
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

            {user.role === "volunteer" ? (
              <div className="mt-3 rounded-xl border border-white/20 bg-white/45 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs text-muted-foreground">
                  Assigned location
                </p>
                <p className="mt-1 text-sm font-medium">
                  {location ? locationLabelMap[location] : "Not selected"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedLocation(
                      location ?? volunteerLocationOptions[0],
                    );
                    setIsLocationModalOpen(true);
                  }}
                  className="mt-2 h-8 w-full justify-center rounded-lg text-xs"
                >
                  <MapPin className="mr-1 h-3.5 w-3.5" /> Edit location
                </Button>
              </div>
            ) : null}

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

      {isLocationModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/90 p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-950/90">
            <h3 className="text-lg font-semibold">Update preferred location</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Current location:{" "}
              {location ? locationLabelMap[location] : "Not selected"}
            </p>

            <div className="mt-4">
              <label
                htmlFor="preferred-location"
                className="text-sm font-medium"
              >
                Preferred location
              </label>
              <select
                id="preferred-location"
                value={selectedLocation}
                onChange={(event) =>
                  setSelectedLocation(event.target.value as VolunteerLocation)
                }
                className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {volunteerLocationOptions.map((option) => (
                  <option key={option} value={option}>
                    {locationLabelMap[option]}
                  </option>
                ))}
              </select>
            </div>

            {locationMessage ? (
              <p className="mt-3 text-sm text-destructive">{locationMessage}</p>
            ) : null}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeLocationModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isUpdatingLocation}
                onClick={async () => {
                  setIsUpdatingLocation(true);
                  setLocationMessage("");
                  try {
                    const volunteer =
                      await updateVolunteerLocation(selectedLocation);
                    setLocation(volunteer.location);
                    setCurrentLocation(volunteer.location);
                    publishRealtimeUpdate("volunteers");
                    closeLocationModal();
                  } catch {
                    setLocationMessage("Failed to update location. Try again.");
                  } finally {
                    setIsUpdatingLocation(false);
                  }
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
