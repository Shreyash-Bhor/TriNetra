import { NextRequest, NextResponse } from "next/server";
import { pickFiveDayForecast } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing latitude or longitude." },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENWEATHER_API_KEY environment variable." },
      { status: 500 },
    );
  }

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
        { next: { revalidate: 600 } },
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
        { next: { revalidate: 600 } },
      ),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      return NextResponse.json(
        { error: "Unable to fetch weather details from OpenWeather." },
        { status: 502 },
      );
    }

    const current = await currentResponse.json();
    const forecastRaw = await forecastResponse.json();
    const items = pickFiveDayForecast(forecastRaw.list ?? []);

    return NextResponse.json({
      current,
      forecast: {
        city: forecastRaw.city?.name ?? current?.name ?? "Your location",
        items,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Weather service is currently unavailable." },
      { status: 503 },
    );
  }
}
