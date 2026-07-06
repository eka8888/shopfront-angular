import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainLayout } from './main-layout';
import { APP_CONFIG } from '../../core/config/app-config.token';

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [
        provideRouter([]),
        {
          provide: APP_CONFIG,
          useValue: {
            appName: 'ShopFront',
            minPasswordLength: 8,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});