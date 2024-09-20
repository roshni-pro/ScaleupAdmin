import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAnchorCompanyComponent } from './main-anchor-company.component';

describe('MainAnchorCompanyComponent', () => {
  let component: MainAnchorCompanyComponent;
  let fixture: ComponentFixture<MainAnchorCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainAnchorCompanyComponent]
    });
    fixture = TestBed.createComponent(MainAnchorCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
