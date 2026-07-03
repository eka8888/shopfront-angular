import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NothingFound } from './nothing-found';

describe('NothingFound', () => {
  let component: NothingFound;
  let fixture: ComponentFixture<NothingFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NothingFound],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NothingFound);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('btnText', 'Go Home');
    fixture.componentRef.setInput('btnLink', '/');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});