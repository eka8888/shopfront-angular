import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { TeamMember } from '../../../../shared/interfaces/about.interface';

@Component({
  selector: 'app-team-card',
  imports: [NgOptimizedImage],
  templateUrl: './team-card.html',
})
export class TeamCard {
  member = input.required<TeamMember>();
}
