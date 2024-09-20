import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareAgreementComponent } from './prepare-agreement.component';

describe('PrepareAgreementComponent', () => {
  let component: PrepareAgreementComponent;
  let fixture: ComponentFixture<PrepareAgreementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepareAgreementComponent]
    });
    fixture = TestBed.createComponent(PrepareAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
