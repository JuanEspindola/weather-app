import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

import { SearchLocationComponent } from '../search-location/search-location.component';
import { SimpleWeather, StyleInfo } from '../../interfaces';
import { WeatherInfoComponent } from '../weather-info/weather-info.component';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [WeatherInfoComponent, SearchLocationComponent, DatePipe, AsyncPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  public weatherService = inject(WeatherService);
  private destroy$ = new Subject<void>();

  public styleInfo: StyleInfo = {
    bgClass: '',
    icon: '',
    isDay: true,
  };

  public weatherData$: Observable<SimpleWeather | null> =
    this.weatherService.weatherData$;

  ngOnInit() {
    this.weatherService.styleInfo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (!data) return;
        this.styleInfo.bgClass = data.bgClass;
        this.styleInfo.icon = data.icon;
        this.styleInfo.isDay = data.isDay;        
      },
      error: () => console.log('Error'),
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
