import { Injectable, signal } from '@angular/core';
import timeLine from '../../shared/data/timeLine.json';
import teamMember from '../../shared/data/teamMember.json';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  timeLineSignal = signal(timeLine);
  teamMemberSignal = signal(teamMember);

  getTimeline() {
    return this.timeLineSignal;
  }

  getTeamMembers() {
    return this.teamMemberSignal;
  }
}
