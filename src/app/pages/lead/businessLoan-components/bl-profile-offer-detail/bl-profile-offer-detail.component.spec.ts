import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlProfileOfferDetailComponent } from './bl-profile-offer-detail.component';

describe('BlProfileOfferDetailComponent', () => {
  let component: BlProfileOfferDetailComponent;
  let fixture: ComponentFixture<BlProfileOfferDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlProfileOfferDetailComponent]
    });
    fixture = TestBed.createComponent(BlProfileOfferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
