import { CrowdDensityMapCard } from "@/components/admin/crowd-density-map-card";
import { LostPersonReportsPanel } from "@/components/lost-person/lost-person-reports-panel";
import { Navigation } from "@/components/navigation";
import { UserHero } from "@/components/user/user-hero";
import { UserWeatherModules } from "@/components/user/user-weather-modules";
import { fetchLostPersonReports } from "@/lib/lostPersonApi";

export default async function UserPage() {
  let reports = [] as Awaited<ReturnType<typeof fetchLostPersonReports>>;

  try {
    reports = await fetchLostPersonReports();
  } catch {
    reports = [];
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.28),
         transparent_38%),radial-gradient(circle_at_85%_0%,rgba(168,85,247,0.22),transparent_40%),
         radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.2),transparent_42%)] transition-opacity duration-300"
      />
      <Navigation />
      <main className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 pt-24 sm:px-8">
        <UserHero />
        <UserWeatherModules />
        <div className="transition-all duration-300">
          <CrowdDensityMapCard />
        </div>

        <LostPersonReportsPanel initialReports={reports} />
      </main>
    </div>
  );
}
