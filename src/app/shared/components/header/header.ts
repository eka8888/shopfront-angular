import { Component } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { Button } from '../button/button';

@Component({
  selector: 'app-header',
  imports: [SearchBar, RouterLink,RouterLinkActive],
  templateUrl: './header.html',
  standalone: true,
})
export class Header {
  navItems = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Shop',
    path: '/shop',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];
  handleSearch(value: string) {
    console.log(value);
  }
}
