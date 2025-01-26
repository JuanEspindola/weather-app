export interface SimpleWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  condition: Condition;
  clouds: number;
  wind_speed: number;
  city: string;
  country: string;
  sunrise: string;
  sunset: string;
  date: Date;
  hourly: Hour[];
}

export interface Hour {
  time: string;
  temp: number;
  icon: string;
  condition: string;
  code: number;
}

interface Condition {
  text: string;
  code: number;
  icon: string;
}
