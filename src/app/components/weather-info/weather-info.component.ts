import { Component, inject } from '@angular/core';
import { SearchLocationComponent } from '../search-location/search-location.component';
import { Observable, Subscription } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { SimpleWeather } from '../../interfaces';

@Component({
  selector: 'app-weather-info',
  standalone: true,
  imports: [SearchLocationComponent, UpperCasePipe, DatePipe],
  templateUrl: './weather-info.component.html',
  styleUrl: './weather-info.component.scss',
})
export class WeatherInfoComponent {
  public cityWeather: SimpleWeather | null = null;
  private cityWeatherSubscription!: Subscription;
  private weatherService = inject(WeatherService);

  ngOnInit() {
    this.cityWeatherSubscription = this.weatherService.weatherData$.subscribe(
      (data) => {
        if (!data) return;
        console.log(data, 'weather info');
        this.cityWeather = data;
      }
    );
  }

  ngOnDestroy() {
    if (this.cityWeatherSubscription) {
      this.cityWeatherSubscription.unsubscribe();
    }
  }
}
