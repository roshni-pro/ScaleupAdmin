import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharCardDetailComponent } from './aadhar-card-detail.component';

describe('AadharCardDetailComponent', () => {
  let component: AadharCardDetailComponent;
  let fixture: ComponentFixture<AadharCardDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AadharCardDetailComponent]
    });
    fixture = TestBed.createComponent(AadharCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
