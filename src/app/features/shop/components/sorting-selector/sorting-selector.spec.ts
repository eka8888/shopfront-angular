import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingSelector } from './sorting-selector';

describe('SortingSelector', () => {
  let component: SortingSelector;
  let fixture: ComponentFixture<SortingSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortingSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(SortingSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
