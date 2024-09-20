import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNbfcCompanyComponent } from './main-nbfc-company.component';

describe('MainNbfcCompanyComponent', () => {
  let component: MainNbfcCompanyComponent;
  let fixture: ComponentFixture<MainNbfcCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainNbfcCompanyComponent]
    });
    fixture = TestBed.createComponent(MainNbfcCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
