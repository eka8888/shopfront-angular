import { Component, effect, output, signal } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-search-bar',
  imports: [Button],
  templateUrl: './search-bar.html',
  standalone: true
})
export class SearchBar {
  search = output<string>();

  searchValue = signal('');
  private searchEffect = effect(() => {
    console.log('Search changed:', this.searchValue());
  });

  ngOnInit(): void {
    console.log('Search bar initialized');
  }
  onSearch(value: string): void {
    this.searchValue.set(value);
    this.search.emit(value);
  }
}
