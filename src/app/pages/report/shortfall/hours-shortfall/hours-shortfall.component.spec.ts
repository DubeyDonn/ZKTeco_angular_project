import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursShortfallComponent } from './hours-shortfall.component';

describe('HoursShortfallComponent', () => {
  let component: HoursShortfallComponent;
  let fixture: ComponentFixture<HoursShortfallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoursShortfallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoursShortfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
