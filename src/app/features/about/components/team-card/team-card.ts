import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-team-card',
  imports: [NgOptimizedImage],
  templateUrl: './team-card.html',
})
export class TeamCard {
  image = input.required<string>();
  alt = input.required<string>();
  name = input.required<string>();
  position = input.required<string>();
}
