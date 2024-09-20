import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementCompletedComponent } from './disbursement-completed.component';

describe('DisbursementCompletedComponent', () => {
  let component: DisbursementCompletedComponent;
  let fixture: ComponentFixture<DisbursementCompletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisbursementCompletedComponent]
    });
    fixture = TestBed.createComponent(DisbursementCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
