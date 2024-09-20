import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlKycDetailsComponent } from './bl-kyc-details.component';

describe('BlKycDetailsComponent', () => {
  let component: BlKycDetailsComponent;
  let fixture: ComponentFixture<BlKycDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlKycDetailsComponent]
    });
    fixture = TestBed.createComponent(BlKycDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
