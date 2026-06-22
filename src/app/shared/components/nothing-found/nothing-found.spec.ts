import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NothingFound } from './nothing-found';

describe('NothingFound', () => {
  let component: NothingFound;
  let fixture: ComponentFixture<NothingFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NothingFound],
    }).compileComponents();

    fixture = TestBed.createComponent(NothingFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
