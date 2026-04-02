import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { getWeatherVisualMeta } from "@/lib/weather";
import { WeatherResponse } from "@/types/weather";

type UserWeatherPanelProps = {
  weather: WeatherResponse | null;
  error: string | null;
};

export function UserWeatherPanel({ weather, error }: UserWeatherPanelProps) {
  const weatherMeta = getWeatherVisualMeta(weather?.weather?.[0]?.main);

  return (
    <section className="rounded-3xl border border-white/30 bg-white/40 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Local Weather</h2>
        <span className="text-2xl" aria-hidden="true">
          {weatherMeta.emoji}
        </span>
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : weather ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/35 bg-white/30 p-4 transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
            <p className="text-sm text-muted-foreground">{weather.name}</p>
            <p className="text-2xl font-semibold">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="text-sm capitalize text-muted-foreground">
              {weather.weather[0]?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/35 bg-white/30 p-3 transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Thermometer className="h-3.5 w-3.5" /> Feels Like
              </p>
              <p className="mt-1 font-semibold">
                {Math.round(weather.main.feels_like)}°C
              </p>
            </div>
            <div className="rounded-xl border border-white/35 bg-white/30 p-3 transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Droplets className="h-3.5 w-3.5" /> Humidity
              </p>
              <p className="mt-1 font-semibold">{weather.main.humidity}%</p>
            </div>
            <div className="rounded-xl border border-white/35 bg-white/30 p-3 transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wind className="h-3.5 w-3.5" /> Wind
              </p>
              <p className="mt-1 font-semibold">{weather.wind.speed} m/s</p>
            </div>
            <div className="rounded-xl border border-white/35 bg-white/30 p-3 transition-colors duration-300 dark:border-white/15 dark:bg-white/5">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Cloud className="h-3.5 w-3.5" /> Condition
              </p>
              <p className="mt-1 font-semibold">{weatherMeta.label}</p>
            </div>
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
