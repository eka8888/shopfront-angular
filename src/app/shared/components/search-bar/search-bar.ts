import { Component, effect, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  standalone: true
})
export class SearchBar {
  search = output<string>();
  searchValue = signal('');
  ngOnInit(): void {
    effect(() => {
      console.log('Search changed:', this.searchValue());
    });
  }
  onSearch(value: string): void {
    this.searchValue.set(value);
    this.search.emit(this.searchValue());
  }
}
