import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisbursementComponent } from './loan-disbursement.component';

describe('LoanDisbursementComponent', () => {
  let component: LoanDisbursementComponent;
  let fixture: ComponentFixture<LoanDisbursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDisbursementComponent]
    });
    fixture = TestBed.createComponent(LoanDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
