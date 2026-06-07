import { Component, input } from '@angular/core';

@Component({
  selector: 'app-timeline-text',
  imports: [],
  templateUrl: './timeline-text.html',
  styleUrl: './timeline-text.scss',
})
export class TimelineText {
  year = input.required<number>();
  description = input.required<string>();
}
