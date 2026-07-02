import { Component } from '@angular/core';
import { Button } from '../button/button';
import { ButtonVariant } from '../../types/form.enums';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [Button, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone: true,
})
export class FooterComponent {
  readonly ButtonVariant = ButtonVariant;

  titles = ['About us', 'Services'];
  sections = [
    [
      { label: 'All Products', path: '/shop' },
      { label: 'Cart', path: '/cart' },
    ],
    [
      { label: 'About Us', path: '/about' },
      {
        label: 'GitHub Repo',
        path: 'https://github.com/eka8888/shopfront-angular',
        external: true,
      },
      { label: 'RS School', path: 'https://rs.school/', external: true },
    ],
  ];
}
