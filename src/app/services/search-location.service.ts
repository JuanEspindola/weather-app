import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { WeatherService } from './weather.service';
import { City } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SearchLocationService {
  private searchTerm = new BehaviorSubject<string>('');
  private displayResults = new BehaviorSubject<boolean>(false);
  private results = new BehaviorSubject<City[]>([]);
  private weatherService = inject(WeatherService);

  searchCityByName() {
    if (!this.searchTerm.getValue()) {
      this.results.next([]);
      return;
    }
    this.weatherService.getCitiesByName(this.searchTerm.getValue()).subscribe({
      next: (res) => {
        this.results.next(res);
        this.displayResults.next(true);
      },
      error: () => {
        this.results.next([]);
        this.displayResults.next(false);
      },
    });
  }

  getResults() {
    return this.results.asObservable();
  }

  setDisplayResults(value: boolean) {
    this.displayResults.next(value);
  }

  getDisplayResults() {
    return this.displayResults.asObservable();
  }

  setInputValue(value: string) {
    this.searchTerm.next(value);
    this.searchCityByName();
  }

  getInputValue() {
    return this.searchTerm.asObservable();
  }
}
