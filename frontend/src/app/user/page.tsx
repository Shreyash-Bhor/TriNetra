import { Navigation } from "@/components/navigation";
import { WeatherCard } from "@/components/weather/weather-card";
import { getCityWeather } from "@/lib/weather";

export default async function UserPage() {
  const { data: weather, error } = await getCityWeather();

  return (
    <div>
      <Navigation />
      <WeatherCard weather={weather} error={error} />
    </div>
  );
}
