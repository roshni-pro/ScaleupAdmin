import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAccountComponent } from './loan-account.component';

describe('LoanAccountComponent', () => {
  let component: LoanAccountComponent;
  let fixture: ComponentFixture<LoanAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanAccountComponent]
    });
    fixture = TestBed.createComponent(LoanAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
