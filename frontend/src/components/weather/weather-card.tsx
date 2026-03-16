import Image from "next/image";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWeatherVisualMeta } from "@/lib/weather";
import { WeatherResponse } from "@/types/weather";

type WeatherCardProps = {
  weather: WeatherResponse | null;
  error: string | null;
};

export function WeatherCard({ weather, error }: WeatherCardProps) {
  const mainWeather = weather?.weather?.[0]?.main;
  const weatherMeta = getWeatherVisualMeta(mainWeather);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${weatherMeta.gradient} pb-10 transition-all duration-500`}
    >
      <div className="max-w-4xl mx-auto px-6 pt-24">
        <Card className="rounded-3xl border-white/30 bg-white/20 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <span>City Weather</span>
              <span aria-hidden="true" className="text-3xl">
                {weatherMeta.emoji}
              </span>
            </CardTitle>
            <CardDescription>
              Static weather card powered by CITY env configuration.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error ? (
              <p className="text-red-500 font-medium">{error}</p>
            ) : weather ? (
              <div className="space-y-5">
                <div className="rounded-2xl border bg-background/60 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-2xl font-bold">{weather.name}</p>
                    <p className="text-sm text-muted-foreground capitalize mt-1">
                      {weatherMeta.label} • {weather.weather[0]?.description}
                    </p>
                  </div>
                  <Image
                    src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`}
                    alt={weather.weather[0]?.description ?? "Weather icon"}
                    width={80}
                    height={80}
                    className="h-20 w-20"
                    unoptimized
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Thermometer className="h-4 w-4" /> Temperature
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {Math.round(weather.main.temp)}°C 🌡️
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Cloud className="h-4 w-4" /> Feels Like
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {Math.round(weather.main.feels_like)}°C 🙂
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Droplets className="h-4 w-4" /> Humidity
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {weather.main.humidity}% 💧
                    </p>
                  </div>

                  <div className="rounded-xl border bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Wind className="h-4 w-4" /> Wind
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      {weather.wind.speed} m/s 🍃
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No weather data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
