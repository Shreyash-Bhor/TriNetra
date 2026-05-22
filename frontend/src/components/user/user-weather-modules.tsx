"use client";

import { useEffect, useState } from "react";
import { fetchWeatherForCoordinates } from "@/lib/weather";
import { ForecastResponse, WeatherResponse } from "@/types/weather";
import { UserWeatherPanel } from "@/components/user/user-weather-panel";
import { UserWeatherForecastPanel } from "@/components/user/user-weather-forecast-panel";

type WeatherState = {
  current: WeatherResponse | null;
  forecast: ForecastResponse | null;
  error: string | null;
};

export function UserWeatherModules() {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: null,
    error: "Detecting your location...",
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({
        current: null,
        forecast: null,
        error: "Geolocation is not supported in this browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = await fetchWeatherForCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
          setState({
            current: payload.current,
            forecast: payload.forecast,
            error: null,
          });
        } catch (error) {
          setState({
            current: null,
            forecast: null,
            error:
              error instanceof Error
                ? error.message
                : "Unable to fetch local weather right now.",
          });
        }
      },
      () => {
        setState({
          current: null,
          forecast: null,
          error:
            "Location permission denied. Please enable location to view local weather.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return (
    <div className="space-y-6">
      <UserWeatherPanel weather={state.current} error={state.error} />
      <UserWeatherForecastPanel forecast={state.forecast} error={state.error} />
    </div>
  );
}
