import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnchorCreditlineComponent } from './anchor-creditline.component';

describe('AnchorCreditlineComponent', () => {
  let component: AnchorCreditlineComponent;
  let fixture: ComponentFixture<AnchorCreditlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnchorCreditlineComponent]
    });
    fixture = TestBed.createComponent(AnchorCreditlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
