import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyBreakdownComponent } from './monthly-breakdown.component';

describe('MonthlyBreakdownComponent', () => {
  let component: MonthlyBreakdownComponent;
  let fixture: ComponentFixture<MonthlyBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyBreakdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
