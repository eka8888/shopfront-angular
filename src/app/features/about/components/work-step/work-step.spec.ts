import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStep } from './work-step';

describe('WorkStep', () => {
  let component: WorkStep;
  let fixture: ComponentFixture<WorkStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkStep],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkStep);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Step title');
    fixture.componentRef.setInput('description', 'Step description');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});