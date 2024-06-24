import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAttendanceInsightComponent } from './daily-attendance-insight.component';

describe('DailyAttendanceInsightComponent', () => {
  let component: DailyAttendanceInsightComponent;
  let fixture: ComponentFixture<DailyAttendanceInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyAttendanceInsightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyAttendanceInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
