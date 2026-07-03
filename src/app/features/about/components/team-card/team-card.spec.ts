import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCard } from './team-card';

describe('TeamCard', () => {
  let component: TeamCard;
  let fixture: ComponentFixture<TeamCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('image', 'test.jpg');
    fixture.componentRef.setInput('alt', 'Test image');
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.componentRef.setInput('position', 'Frontend Developer');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});