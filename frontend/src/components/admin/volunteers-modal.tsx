"use client";

import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RegisteredVolunteer } from "@/components/admin/admin-dashboard-shared";

type Props = {
  isOpen: boolean;
  locationFilter: string;
  usernameSearch: string;
  locationOptions: string[];
  volunteers: RegisteredVolunteer[];
  onClose: () => void;
  onLocationFilterChange: (value: string) => void;
  onUsernameSearchChange: (value: string) => void;
};

const isRecent = (timestamp: string) =>
  Date.now() - new Date(timestamp).getTime() <= 24 * 60 * 60 * 1000;

const hasRecentlyUpdatedLocation = (volunteer: RegisteredVolunteer) => {
  if (!volunteer.location) return false;
  return (
    isRecent(volunteer.updatedAt) &&
    new Date(volunteer.updatedAt).getTime() >
      new Date(volunteer.createdAt).getTime()
  );
};

export function VolunteersModal(props: Props) {
  const {
    isOpen,
    locationFilter,
    usernameSearch,
    locationOptions,
    volunteers,
    onClose,
    onLocationFilterChange,
    onUsernameSearchChange,
  } = props;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <Card className="h-[90vh] w-[90vw] min-h-[360px] min-w-[320px] overflow-hidden border border-white/30 bg-white/85 shadow-2xl dark:border-white/15 dark:bg-black/75">
        <CardHeader className="border-b border-white/20 pb-4 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Registered Volunteers</CardTitle>
              <CardDescription>
                Filter by location and search by username.
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={locationFilter}
              onChange={(event) => onLocationFilterChange(event.target.value)}
              className="h-10 rounded-xl border border-white/30 bg-white/65 px-3 text-sm outline-none dark:border-white/15 dark:bg-black/30"
            >
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location === "all" ? "All Locations" : location}
                </option>
              ))}
            </select>
            <div className="flex flex-1 items-center gap-2">
              <Button type="button" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Input
                value={usernameSearch}
                onChange={(event) => onUsernameSearchChange(event.target.value)}
                placeholder="Search by username"
                className="border-white/30 bg-white/65 dark:border-white/15 dark:bg-black/30"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[90vh] overflow-y-auto space-y-3 pt-4">
          {volunteers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No volunteers found.
            </p>
          ) : (
            volunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="space-y-2 rounded-2xl border border-white/30 bg-white/55 p-4 dark:border-white/15 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{volunteer.username}</p>
                  <div className="flex flex-wrap gap-2">
                    {isRecent(volunteer.createdAt) ? (
                      <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        New volunteer
                      </Badge>
                    ) : null}
                    {hasRecentlyUpdatedLocation(volunteer) ? (
                      <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        Location updated recently
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm">First Name: {volunteer.firstName}</p>
                <p className="text-sm">
                  Last Name: {volunteer.lastName ?? "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Assigned location: {volunteer.location ?? "Not selected"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
