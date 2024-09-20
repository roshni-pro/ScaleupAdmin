import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlLoanDetailsComponent } from './bl-loan-details.component';

describe('BlLoanDetailsComponent', () => {
  let component: BlLoanDetailsComponent;
  let fixture: ComponentFixture<BlLoanDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlLoanDetailsComponent]
    });
    fixture = TestBed.createComponent(BlLoanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
