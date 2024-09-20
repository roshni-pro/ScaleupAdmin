import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOfferDetailComponent } from './profile-offer-detail.component';

describe('ProfileOfferDetailComponent', () => {
  let component: ProfileOfferDetailComponent;
  let fixture: ComponentFixture<ProfileOfferDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileOfferDetailComponent]
    });
    fixture = TestBed.createComponent(ProfileOfferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
