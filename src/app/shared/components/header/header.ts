import { Component } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';
import { RouterLink } from '@angular/router';
import { Button } from '../button/button';

@Component({
  selector: 'app-header',
  imports: [SearchBar, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  handleSearch(value: string) {
    console.log(value);
  }
}
