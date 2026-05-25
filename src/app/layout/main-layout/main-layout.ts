import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
