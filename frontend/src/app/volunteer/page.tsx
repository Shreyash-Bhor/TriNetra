import { Navigation } from "@/components/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import { VolunteerDashboardContent } from "@/components/volunteer/volunteer-dashboard-content";
import { getCityWeather } from "@/lib/weather";

export default async function VolunteerDashboard() {
  const { data: weather, error } = await getCityWeather();

  return (
    <RoleGuard allowedRoles={["volunteer"]}>
      <div className="relative min-h-screen overflow-x-hidden pb-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.24),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.20),transparent_45%)]" />
        <Navigation />
        <VolunteerDashboardContent weather={weather} weatherError={error} />
      </div>
    </RoleGuard>
  );
}
