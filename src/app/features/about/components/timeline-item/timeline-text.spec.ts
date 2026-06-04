import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineText } from './timeline-text';

describe('TimelineItem', () => {
  let component: TimelineText;
  let fixture: ComponentFixture<TimelineText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineText],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
