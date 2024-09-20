import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsaUsersComponent } from './dsa-users.component';

describe('DsaUsersComponent', () => {
  let component: DsaUsersComponent;
  let fixture: ComponentFixture<DsaUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DsaUsersComponent]
    });
    fixture = TestBed.createComponent(DsaUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
