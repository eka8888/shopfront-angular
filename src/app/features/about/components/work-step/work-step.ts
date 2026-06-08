import { Component, input } from '@angular/core';

@Component({
  selector: 'app-work-step',
  imports: [],
  templateUrl: './work-step.html',
  styleUrl: './work-step.scss',
})
export class WorkStep {
  title = input.required<string>();
  description = input.required<string>();
}
