import { Cloud, Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { getWeatherVisualMeta } from "@/lib/weather";
import { WeatherResponse } from "@/types/weather";

type UserWeatherPanelProps = {
  weather: WeatherResponse | null;
  error: string | null;
};

export function UserWeatherPanel({ weather, error }: UserWeatherPanelProps) {
  const weatherMeta = getWeatherVisualMeta(weather?.weather?.[0]?.main);
  const stats = weather
    ? [
        {
          label: "Temperature",
          value: `${Math.round(weather.main.temp)}°C`,
          icon: Thermometer,
          toneClass: "text-orange-600 dark:text-orange-300",
        },
        {
          label: "Feels Like",
          value: `${Math.round(weather.main.feels_like)}°C`,
          icon: Sun,
          toneClass: "text-amber-600 dark:text-amber-300",
        },
        {
          label: "Humidity",
          value: `${weather.main.humidity}%`,
          icon: Droplets,
          toneClass: "text-sky-600 dark:text-sky-300",
        },
        {
          label: "Wind",
          value: `${weather.wind.speed} m/s`,
          icon: Wind,
          toneClass: "text-cyan-600 dark:text-cyan-300",
        },
      ]
    : [];

  return (
    <section className="rounded-3xl border border-slate-300/90 bg-white/70 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/15 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">🌍 Local Weather Now</h2>
        <span className="text-2xl" aria-hidden="true">
          {weatherMeta.emoji}
        </span>
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : weather ? (
        <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max flex-nowrap gap-3">
            <div className="rounded-2xl border border-slate-300/85 bg-white/75 p-4 transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                {weather.name}
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {Math.round(weather.main.temp)}°C
              </p>

              <p className="text-sm capitalize text-muted-foreground">
                <Cloud className="mr-1 inline h-3.5 w-3.5" />{" "}
                {weatherMeta.label} • {weather.weather[0]?.description}
              </p>
            </div>

            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-300/85 bg-white/75 p-4 transition-colors duration-300 dark:border-white/15 dark:bg-white/5"
              >
                <p
                  className={`flex items-center gap-1 text-xs font-medium ${item.toneClass}`}
                >
                  <item.icon className="h-3.5 w-3.5" /> {item.label}
                </p>
                <p className="mt-1 font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No weather data available.
        </p>
      )}
    </section>
  );
}
