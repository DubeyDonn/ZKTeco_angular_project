import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyBreakdownComponent } from './weekly-breakdown.component';

describe('WeeklyBreakdownComponent', () => {
  let component: WeeklyBreakdownComponent;
  let fixture: ComponentFixture<WeeklyBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyBreakdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklyBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
