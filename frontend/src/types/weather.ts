export type WeatherResponse = {
  name: string;
  dt: number;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
};
export type ForecastItem = {
  dt: number;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
};

export type ForecastResponse = {
  city: string;
  items: ForecastItem[];
};
export type WeatherVisualMeta = {
  emoji: string;
  gradient: string;
  label: string;
};
