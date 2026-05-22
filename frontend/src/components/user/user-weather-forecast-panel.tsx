import Image from "next/image";
import { ForecastResponse } from "@/types/weather";
import { getWeatherVisualMeta } from "@/lib/weather";

type UserWeatherForecastPanelProps = {
  forecast: ForecastResponse | null;
  error: string | null;
};

export function UserWeatherForecastPanel({
  forecast,
  error,
}: UserWeatherForecastPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-300/90 bg-white/70 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/15 dark:bg-white/5">
      <h2 className="mb-4 text-xl font-semibold">📅 5-Day Forecast Flash</h2>
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : forecast ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {forecast.items.map((item) => {
            const meta = getWeatherVisualMeta(item.condition);
            return (
              <article
                key={item.dt}
                className="h-full rounded-2xl border border-slate-300/85 bg-white/75 p-4 transition-colors duration-300 dark:border-white/15 dark:bg-white/5"
              >
                <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                  {new Date(item.dt * 1000).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    {Math.round(item.temp)}°C
                  </p>
                  <span className="text-lg" aria-hidden="true">
                    {meta.emoji}
                  </span>
                </div>
                <Image
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt={item.description}
                  width={50}
                  height={50}
                  className="h-10 w-10"
                  unoptimized
                />
                <p className="text-xs capitalize text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  H: {Math.round(item.tempMax)}° • L: {Math.round(item.tempMin)}
                  °
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No forecast data available.
        </p>
      )}
    </section>
  );
}
