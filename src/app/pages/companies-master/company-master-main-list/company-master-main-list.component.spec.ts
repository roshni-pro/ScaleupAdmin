import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMasterMainListComponent } from './company-master-main-list.component';

describe('CompanyMasterMainListComponent', () => {
  let component: CompanyMasterMainListComponent;
  let fixture: ComponentFixture<CompanyMasterMainListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyMasterMainListComponent]
    });
    fixture = TestBed.createComponent(CompanyMasterMainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
