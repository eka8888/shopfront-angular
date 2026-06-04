import { Component, inject } from '@angular/core';
import { AboutService } from '../../about.service';
import { NgOptimizedImage } from '@angular/common';
import { TimelineText } from '../../components/timeline-item/timeline-text';

@Component({
  selector: 'app-timeline-section',
  imports: [NgOptimizedImage, TimelineText],
  templateUrl: './timeline-section.html',
  styleUrl: './timeline-section.scss',
})
export class TimelineSection {
  private aboutService = inject(AboutService);

  timeLine = this.aboutService.getTimeline();
}
