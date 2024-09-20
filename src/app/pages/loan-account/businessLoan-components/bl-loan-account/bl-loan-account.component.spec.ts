import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLLoanAccountComponent } from './bl-loan-account.component';

describe('BLLoanAccountComponent', () => {
  let component: BLLoanAccountComponent;
  let fixture: ComponentFixture<BLLoanAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BLLoanAccountComponent]
    });
    fixture = TestBed.createComponent(BLLoanAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
