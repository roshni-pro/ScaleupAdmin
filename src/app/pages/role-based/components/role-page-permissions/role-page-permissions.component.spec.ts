import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePagePermissionsComponent } from './role-page-permissions.component';

describe('RolePagePermissionsComponent', () => {
  let component: RolePagePermissionsComponent;
  let fixture: ComponentFixture<RolePagePermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolePagePermissionsComponent]
    });
    fixture = TestBed.createComponent(RolePagePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
