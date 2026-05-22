import { Component,  OnInit,  output, signal } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-search-bar',
  imports: [Button],
  templateUrl: './search-bar.html',
  standalone: true
})
export class SearchBar implements OnInit{
  searchChange = output<string>();

  searchValue = signal('');


  ngOnInit(): void {
    console.log('Search bar initialized');
  }
  onSearch(value: string): void {
    this.searchValue.set(value);
    this.searchChange.emit(value);
  }
}
