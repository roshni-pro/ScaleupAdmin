import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlLeadProfileComponent } from './bl-lead-profile.component';

describe('BlLeadProfileComponent', () => {
  let component: BlLeadProfileComponent;
  let fixture: ComponentFixture<BlLeadProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlLeadProfileComponent]
    });
    fixture = TestBed.createComponent(BlLeadProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
