import axios from "axios";
import { Request, Response } from "express";

export const getWeatherForecast = async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    // 1️⃣ Current Weather (FREE)
    const currentWeather = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      }
    );

    // 2️⃣ 5-Day Forecast (FREE)
    const forecast = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      }
    );

    return res.status(200).json({
      city,
      current: {
        temperature: currentWeather.data.main.temp,
        humidity: currentWeather.data.main.humidity,
        windSpeed: currentWeather.data.wind.speed,
        description: currentWeather.data.weather[0].description,
      },
      forecast: forecast.data.list.slice(0, 5).map((item: any) => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        description: item.weather[0].description,
      })),
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to fetch weather data",
    });
  }
};
