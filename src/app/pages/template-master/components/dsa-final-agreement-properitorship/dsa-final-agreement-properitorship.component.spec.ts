import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DSAFinalAgreementProperitorshipComponent } from './dsa-final-agreement-properitorship.component';

describe('DSAFinalAgreementProperitorshipComponent', () => {
  let component: DSAFinalAgreementProperitorshipComponent;
  let fixture: ComponentFixture<DSAFinalAgreementProperitorshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DSAFinalAgreementProperitorshipComponent]
    });
    fixture = TestBed.createComponent(DSAFinalAgreementProperitorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
