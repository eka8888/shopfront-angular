import { Component, inject } from '@angular/core';
import { AboutService } from '../../about.service';
import { TeamCard } from '../../components/team-card/team-card';

@Component({
  selector: 'app-team-section',
  imports: [TeamCard],
  templateUrl: './team-section.html',
  styleUrl: './team-section.scss',
})
export class TeamSection {
  private aboutService = inject(AboutService);

  memberSignal = this.aboutService.getTeamMembers();
}
