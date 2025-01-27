import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import {
  SimpleWeather,
  StyleInfo,
  City,
  Forecast,
  Current,
  Hour,
} from '../interfaces';
import { weatherCodeMap, WeatherCondition } from '../constants/condition.codes';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private apiKey = environment.weatherApiKey;

  private cityWeahter: BehaviorSubject<SimpleWeather | null> =
    new BehaviorSubject<SimpleWeather | null>(null);

  weatherData$ = this.cityWeahter.asObservable();

  private styleInfo: BehaviorSubject<StyleInfo | null> =
    new BehaviorSubject<StyleInfo | null>({
      bgClass: 'clear-day',
      icon: '',
      isDay: true,
    });

  styleInfo$ = this.styleInfo.asObservable();

  getCitiesByName(term: string): Observable<City[]> {
    return this.http.get<City[]>(
      `${this.baseUrl}/search.json?q=${term}&key=${this.apiKey}`
    );
  }

  getCityByCoords({ lat, lon }: City): void {
    this.http
      .get<Forecast>(
        `${this.baseUrl}/forecast.json?q=${lat},${lon}&days=1&aqi=no&key=${this.apiKey}`
      )
      .subscribe({
        next: (data: Forecast) => {
          this.cityWeahter.next(this.mapWhaterData(data));
          this.setStyleInfo(data);
        },
        error: () => this.cityWeahter.next(null),
      });
  }

  private setStyleInfo(data: Forecast): void {
    const currentCondition = { ...this.cityWeahter.getValue()?.condition };
    let styleInfo: StyleInfo = {
      bgClass: '',
      icon: '',
      isDay: data.current.is_day === 1,
    };

    styleInfo.bgClass =
      weatherCodeMap[currentCondition.code!] || WeatherCondition.ClearDay;

    styleInfo.icon = currentCondition.icon || '';

    this.styleInfo.next(styleInfo);
  }

  private mapWhaterData(data: Forecast): SimpleWeather {
    console.log(data, 'data');
    return {
      temp: Math.round(data.current.temp_c),
      feels_like: data.current.feelslike_c,
      temp_min: Math.round(data.forecast.forecastday[0].day.mintemp_c),
      temp_max: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
      humidity: data.current.humidity,
      condition: { ...data.current.condition },
      clouds: data.current.cloud,
      wind_speed: Math.round(data.current.wind_kph),
      city: data.location.name,
      country: data.location.country,
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset,
      date: new Date(data.location.localtime),
      hourly: this.mapHours(
        data.forecast.forecastday[0].hour,
        data.location.localtime
      ),
    };
  }

  private mapHours(data: Current[], localTime: string): Hour[] {
    const now = new Date(localTime).getHours();
    return data
      .filter((hour: Current) => {
        const hourTime = new Date(hour.time!).getHours();
        return hourTime >= now;
      })
      .map((hour: Current): Hour => {
        const { time, temp_c, condition } = hour;
        return {
          time: time ?? '',
          temp: Math.round(temp_c),
          icon: condition.icon,
          condition: condition.text.toLowerCase(),
          code: condition.code,
        };
      });
  }
}
