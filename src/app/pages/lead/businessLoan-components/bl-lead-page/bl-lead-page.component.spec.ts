import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLLeadPageComponent } from './bl-lead-page.component';

describe('BLLeadPageComponent', () => {
  let component: BLLeadPageComponent;
  let fixture: ComponentFixture<BLLeadPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BLLeadPageComponent]
    });
    fixture = TestBed.createComponent(BLLeadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
