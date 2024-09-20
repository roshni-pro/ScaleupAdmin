import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLPaymentLayoutComponent } from './bl-payment-layout.component';

describe('BLPaymentLayoutComponent', () => {
  let component: BLPaymentLayoutComponent;
  let fixture: ComponentFixture<BLPaymentLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BLPaymentLayoutComponent]
    });
    fixture = TestBed.createComponent(BLPaymentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
