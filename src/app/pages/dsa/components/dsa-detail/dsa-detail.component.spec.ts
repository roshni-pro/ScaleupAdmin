import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsaDetailComponent } from './dsa-detail.component';

describe('DsaDetailComponent', () => {
  let component: DsaDetailComponent;
  let fixture: ComponentFixture<DsaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DsaDetailComponent]
    });
    fixture = TestBed.createComponent(DsaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
