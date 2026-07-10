import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  standalone: true,
})
export class SearchBar {
  searchValue = input<string>();
  searchChange = output<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchChange.emit(value);
  }
}
