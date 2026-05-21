import api from "@/lib/axios";

export const volunteerLocationOptions = [
  "Ramkund",
  "Kalaram_Temple",
  "Panchavati_Market",
] as const;

export type VolunteerLocation = (typeof volunteerLocationOptions)[number];

export const locationLabelMap: Record<VolunteerLocation, string> = {
  Ramkund: "Ramkund",
  Kalaram_Temple: "Kalaram Temple",
  Panchavati_Market: "Panchavati Market",
};

export async function updateVolunteerLocation(location: VolunteerLocation) {
  const response = await api.patch<{
    volunteer: { location: VolunteerLocation };
  }>("/auth/volunteer/location", { location });

  return response.data.volunteer;
}
