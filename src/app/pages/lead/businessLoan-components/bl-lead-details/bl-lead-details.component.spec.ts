import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlLeadDetailsComponent } from './bl-lead-details.component';

describe('BlLeadDetailsComponent', () => {
  let component: BlLeadDetailsComponent;
  let fixture: ComponentFixture<BlLeadDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlLeadDetailsComponent]
    });
    fixture = TestBed.createComponent(BlLeadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
