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

  titles = ['About us', 'Services', 'Portfolio'];
  sections = [
    ['Mission', 'Our team', 'Awards', 'Testimonials', 'Privacy policy'],
    ['Web design', 'Web development', 'Mobile design', 'UI/UX design', 'Branding design'],
    ['Corporate websites', 'E-commerce', 'Mobile apps', 'Landing pages', 'UI/UX projects'],
  ];
}
