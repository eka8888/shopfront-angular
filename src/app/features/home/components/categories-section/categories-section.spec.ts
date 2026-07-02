import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSection } from './categories-section';
import { provideRouter } from '@angular/router';

describe('CategoriesSection', () => {
  let component: CategoriesSection;
  let fixture: ComponentFixture<CategoriesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesSection],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
