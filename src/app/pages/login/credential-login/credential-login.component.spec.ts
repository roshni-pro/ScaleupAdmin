import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialLoginComponent } from './credential-login.component';

describe('CredentialLoginComponent', () => {
  let component: CredentialLoginComponent;
  let fixture: ComponentFixture<CredentialLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialLoginComponent]
    });
    fixture = TestBed.createComponent(CredentialLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
