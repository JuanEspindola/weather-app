import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { SearchLocationService } from '../../services/search-location.service';
import { WeatherService } from '../../services/weather.service';
import { City } from '../../interfaces';

@Component({
  selector: 'app-search-location',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './search-location.component.html',
  styleUrl: './search-location.component.scss',
})
export class SearchLocationComponent {
  cityName: FormControl = new FormControl();

  public searchLocationService = inject(SearchLocationService);
  private weatherService = inject(WeatherService);
  public activeIndex = -1;
  results: City[] = [];

  ngOnInit() {
    this.cityName.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((term: string) => {
        this.searchLocationService.setInputValue(term);
      });

    this.searchLocationService.getInputValue().subscribe((value) => {
      this.cityName.setValue(value, { emitEvent: false });
    });

    this.searchLocationService.getResults().subscribe((results) => {
      this.results = results;
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % this.results.length;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.activeIndex =
        (this.activeIndex - 1 + this.results.length) % this.results.length;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.selectLocation(this.results[this.activeIndex]);
      this.activeIndex = -1;
      event.preventDefault();
    }
  }

  selectLocation(selectedCity: City) {
    this.searchLocationService.setDisplayResults(false);
    this.weatherService.getCityByCoords(selectedCity);
  }

  // searchValue() {
  //   this.searchLocationService.searchCityByName();
  // }
}
