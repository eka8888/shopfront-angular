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
      title: 'Product design',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis.',
    },
    {
      title: 'Crafted',
      description: 'Rutrum vitae risus eget, vulputate aliquam nisi ex gravida neque tempus.',
    },
    {
      title: 'Sell product',
      description: 'Maecenas sem eros, rutrum vitae risus eget, vulputate aliquam nisi.',
    },
  ];
}
