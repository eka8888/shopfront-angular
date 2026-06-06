import { Component } from '@angular/core';
import { TimelineSection } from '../../sections/timeline-section/timeline-section';
import { HowWeWork } from '../../sections/how-we-work/how-we-work';
import { TeamSection } from '../../sections/team-section/team-section';
import { Newsletter } from '../../sections/newsletter/newsletter';

@Component({
  selector: 'app-about',
  imports: [TimelineSection, HowWeWork, TeamSection, Newsletter],
  templateUrl: './about-page.html',
})
export class AboutPage {}
