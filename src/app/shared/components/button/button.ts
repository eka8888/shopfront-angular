import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: 'dark' | 'outline' | 'outline-light' | 'text' = 'outline';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fullWidth: boolean = false;
}
