import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSection } from './timeline-section';

describe('TimelineSection', () => {
  let component: TimelineSection;
  let fixture: ComponentFixture<TimelineSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineSection],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
