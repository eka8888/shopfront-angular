import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { WorkStep } from '../../components/work-step/work-step';

@Component({
  selector: 'app-how-we-work',
  imports: [NgOptimizedImage, WorkStep],
  templateUrl: './how-we-work.html',
  styleUrl: './how-we-work.scss',
})
export class HowWeWork {
  steps = [
    {
      title: 'Split the work',
      description:
        'Each sprint, the team lead broke down the feature set and split tasks by area — auth, cart, shared components — so everyone could move in parallel without stepping on each other.',
    },
    {
      title: 'Build & review',
      description:
        'Every feature went through a pull request before merging into dev. Code reviews caught real issues — from missing ControlValueAccessor implementations to ESLint violations — before they reached main.',
    },
    {
      title: 'Ship & reflect',
      description:
        'After each sprint, we deployed the latest build and wrote a short dev log — what worked, what we learned, and what to do differently next time.',
    },
  ];
}
