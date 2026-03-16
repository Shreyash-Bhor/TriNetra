export type WeatherResponse = {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
};

export type WeatherVisualMeta = {
  emoji: string;
  gradient: string;
  label: string;
};
