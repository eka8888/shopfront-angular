import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArrivalsSection } from './new-arrivals-section';

describe('NewArrivalsSection', () => {
  let component: NewArrivalsSection;
  let fixture: ComponentFixture<NewArrivalsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewArrivalsSection],
    }).compileComponents();

    fixture = TestBed.createComponent(NewArrivalsSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
