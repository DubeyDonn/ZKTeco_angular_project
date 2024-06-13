import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFormFieldComponent } from './email-form-field.component';

describe('EmailEmailFormFieldComponent', () => {
  let component: EmailFormFieldComponent;
  let fixture: ComponentFixture<EmailFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
