import { TestBed } from '@angular/core/testing';

import { DailyAttendanceService } from './daily-attendance.service';

describe('DailyAttendanceService', () => {
  let service: DailyAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
