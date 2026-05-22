import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-textarea',
  imports: [NgClass],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
})
export class Textarea {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() rows: number = 5;
}
