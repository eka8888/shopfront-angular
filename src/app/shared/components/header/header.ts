import { Component } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { Button } from '../button/button';

@Component({
  selector: 'app-header',
  imports: [SearchBar, RouterLink,RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  handleSearch(value: string) {
    console.log(value);
  }
}
