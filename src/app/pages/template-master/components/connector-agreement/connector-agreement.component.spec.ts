import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorAgreementComponent } from './connector-agreement.component';

describe('ConnectorAgreementComponent', () => {
  let component: ConnectorAgreementComponent;
  let fixture: ComponentFixture<ConnectorAgreementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectorAgreementComponent]
    });
    fixture = TestBed.createComponent(ConnectorAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
