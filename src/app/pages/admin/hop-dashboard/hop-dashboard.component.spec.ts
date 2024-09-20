import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopDashboardComponent } from './hop-dashboard.component';

describe('HopDashboardComponent', () => {
  let component: HopDashboardComponent;
  let fixture: ComponentFixture<HopDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HopDashboardComponent]
    });
    fixture = TestBed.createComponent(HopDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
