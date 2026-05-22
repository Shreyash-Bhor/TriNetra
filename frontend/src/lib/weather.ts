import {
  ForecastItem,
  ForecastResponse,
  WeatherResponse,
  WeatherVisualMeta,
} from "@/types/weather";
const weatherVisualMap: Record<string, WeatherVisualMeta> = {
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

const fallbackWeatherVisual: WeatherVisualMeta = {
  emoji: "🌤️",
  gradient: "from-sky-300/25 via-indigo-300/20 to-purple-300/20",
  label: "Current Weather",
};

export const getWeatherVisualMeta = (condition?: string): WeatherVisualMeta => {
  if (!condition) {
    return fallbackWeatherVisual;
  }

  return weatherVisualMap[condition] ?? fallbackWeatherVisual;
};

export async function getCityWeather(): Promise<{
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
        city,
      )}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 600 } },
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
export function pickFiveDayForecast(items: any[]): ForecastItem[] {
  const perDay = new Map<string, any>();

  for (const item of items) {
    const date = new Date(item.dt * 1000).toISOString().slice(0, 10);
    if (!perDay.has(date) && perDay.size < 5) {
      perDay.set(date, item);
    }
  }

  return Array.from(perDay.values()).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    tempMin: item.main.temp_min,
    tempMax: item.main.temp_max,
    condition: item.weather?.[0]?.main ?? "Unknown",
    description: item.weather?.[0]?.description ?? "",
    icon: item.weather?.[0]?.icon ?? "01d",
    humidity: item.main.humidity,
  }));
}

export async function fetchWeatherForCoordinates(lat: number, lon: number) {
  const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  const payload = (await response.json()) as {
    current: WeatherResponse;
    forecast: ForecastResponse;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to fetch weather details.");
  }

  return payload;
}
