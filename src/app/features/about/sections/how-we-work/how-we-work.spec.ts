import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowWeWork } from './how-we-work';

describe('HowWeWorkComponent', () => {
  let component: HowWeWork;
  let fixture: ComponentFixture<HowWeWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowWeWork],
    }).compileComponents();

    fixture = TestBed.createComponent(HowWeWork);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
