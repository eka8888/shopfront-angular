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

    fixture.componentRef.setInput('year', 2024);
    fixture.componentRef.setInput('description', 'Test description');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});