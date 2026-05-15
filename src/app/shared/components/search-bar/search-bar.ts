import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  standalone: true
})
export class SearchBar {
  search = output<string>();

  onSearch(value: string): void {
    this.search.emit(value);
  }
}
