import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSection } from './team-section';

describe('TeamSection', () => {
  let component: TeamSection;
  let fixture: ComponentFixture<TeamSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSection],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
