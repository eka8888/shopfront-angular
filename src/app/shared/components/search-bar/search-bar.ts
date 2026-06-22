import { Component, OnInit, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  standalone: true,
})
export class SearchBar implements OnInit {
  searchValue = input<string>();
  searchChange = output<string>();

  ngOnInit(): void {
    console.log('Search bar initialized');
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchChange.emit(value);
  }
}
