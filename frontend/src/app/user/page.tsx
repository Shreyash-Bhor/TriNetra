import Image from "next/image";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";

type WeatherResponse = {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
};

const weatherVisualMap: Record<
  string,
  { emoji: string; gradient: string; label: string }
> = {
  Clear: {
    emoji: "☀️",
    gradient: "from-amber-300/25 via-orange-300/20 to-yellow-200/20",
    label: "Clear Sky",
  },
  Clouds: {
    emoji: "☁️",
    gradient: "from-slate-300/25 via-slate-200/20 to-zinc-200/20",
    label: "Cloudy",
  },
  Rain: {
    emoji: "🌧️",
    gradient: "from-sky-400/25 via-blue-400/20 to-indigo-400/20",
    label: "Rainy",
  },
  Drizzle: {
    emoji: "🌦️",
    gradient: "from-cyan-300/25 via-sky-300/20 to-blue-300/20",
    label: "Drizzle",
  },
  Thunderstorm: {
    emoji: "⛈️",
    gradient: "from-violet-500/25 via-indigo-500/20 to-slate-500/20",
    label: "Thunderstorm",
  },
  Snow: {
    emoji: "❄️",
    gradient: "from-cyan-100/25 via-slate-100/20 to-white/20",
    label: "Snow",
  },
  Mist: {
    emoji: "🌫️",
    gradient: "from-zinc-300/25 via-stone-200/20 to-slate-200/20",
    label: "Misty",
  },
  Haze: {
    emoji: "🌁",
    gradient: "from-zinc-300/25 via-amber-100/20 to-slate-200/20",
    label: "Hazy",
  },
};

async function getCityWeather(): Promise<{
  data: WeatherResponse | null;
  error: string | null;
}> {
  const city = process.env.CITY;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return {
      data: null,
      error: "Missing CITY environment variable.",
    };
  }

  if (!apiKey) {
    return {
      data: null,
      error: "Missing OPENWEATHER_API_KEY environment variable.",
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 600 } }
    );

    if (!response.ok) {
      return {
        data: null,
        error: `Unable to fetch weather for ${city}.`,
      };
    }

    const data: WeatherResponse = await response.json();
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: "Weather service is currently unavailable.",
    };
  }
}

export default async function UserPage() {
  const { data: weather, error } = await getCityWeather();
  const mainWeather = weather?.weather?.[0]?.main ?? "Clear";
  const weatherMeta = weatherVisualMap[mainWeather] ?? {
    emoji: "🌤️",
    gradient: "from-sky-300/25 via-indigo-300/20 to-purple-300/20",
    label: "Current Weather",
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${weatherMeta.gradient} pb-10 transition-all duration-500`}
    >
      <Navigation />

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
              <p className="text-muted-foreground">No weather data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
