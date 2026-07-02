import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoSection } from './promo-section';
import { provideRouter } from '@angular/router';

describe('PromoSection', () => {
  let component: PromoSection;
  let fixture: ComponentFixture<PromoSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoSection],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PromoSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
