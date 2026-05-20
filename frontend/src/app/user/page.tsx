import { CrowdDensityMapCard } from "@/components/admin/crowd-density-map-card";
import { Navigation } from "@/components/navigation";
import { UserAlertsPanel } from "@/components/user/user-alerts-panel";
import { UserHero } from "@/components/user/user-hero";
import { UserWeatherPanel } from "@/components/user/user-weather-panel";
import { fetchAlerts } from "@/lib/alertApi";
import { getCityWeather } from "@/lib/weather";
export default async function UserPage() {
  const { data: weather, error } = await getCityWeather();
  let alerts = [] as Awaited<ReturnType<typeof fetchAlerts>>;

  try {
    alerts = await fetchAlerts("volunteer");
  } catch {
    alerts = [];
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.28),
        transparent_38%),radial-gradient(circle_at_85%_0%,rgba(168,85,247,0.22),transparent_40%),
        radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.2),transparent_42%)] transition-opacity duration-300"
      />
      <Navigation />

      <main className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 pt-24 sm:px-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UserHero />
          <UserAlertsPanel alerts={alerts} />
          <div className="transition-all duration-300">
            <CrowdDensityMapCard />
          </div>
        </div>

        <aside className="space-y-6">
          <UserWeatherPanel weather={weather} error={error} />
          <section className="rounded-3xl border border-white/30 bg-white/40 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-lg font-semibold">User Tips</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="transition-colors duration-300 hover:text-foreground">
                • Keep notifications enabled for emergency broadcasts.
              </li>
              <li className="transition-colors duration-300 hover:text-foreground">
                • Follow map density indicators before entering crowded zones.
              </li>
              <li className="transition-colors duration-300 hover:text-foreground">
                • Share incident details promptly with volunteers/admin teams.
              </li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
