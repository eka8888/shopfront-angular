import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPage } from './shop-page';
import { provideRouter } from '@angular/router';

describe('ShopPage', () => {
  let component: ShopPage;
  let fixture: ComponentFixture<ShopPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
