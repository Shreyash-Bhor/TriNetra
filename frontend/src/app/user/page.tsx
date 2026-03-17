import { Navigation } from "@/components/navigation";
import { WeatherCard } from "@/components/weather/weather-card";
import { fetchAlerts } from "@/lib/alertApi";
import { getCityWeather } from "@/lib/weather";

export default async function UserPage() {
  const { data: weather, error } = await getCityWeather();
  let alerts = [] as Awaited<ReturnType<typeof fetchAlerts>>;

  try {
    alerts = await fetchAlerts("user");
  } catch {
    alerts = [];
  }

  return (
    <div>
      <Navigation />
      <div className="px-8 pt-24 max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl border p-4">
          <h2 className="text-xl font-semibold">Emergency Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">
              No active alerts.
            </p>
          ) : (
            <div className="space-y-3 mt-3">
              {alerts.map((alert) => (
                <div key={alert._id} className="rounded-xl border p-3">
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <WeatherCard weather={weather} error={error} />
      </div>
    </div>
  );
}
