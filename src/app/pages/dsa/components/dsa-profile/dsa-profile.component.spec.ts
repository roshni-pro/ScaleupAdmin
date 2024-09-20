import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsaProfileComponent } from './dsa-profile.component';

describe('DsaProfileComponent', () => {
  let component: DsaProfileComponent;
  let fixture: ComponentFixture<DsaProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DsaProfileComponent]
    });
    fixture = TestBed.createComponent(DsaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
