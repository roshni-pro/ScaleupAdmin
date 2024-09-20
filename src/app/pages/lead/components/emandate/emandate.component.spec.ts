import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmandateComponent } from './emandate.component';

describe('EmandateComponent', () => {
  let component: EmandateComponent;
  let fixture: ComponentFixture<EmandateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmandateComponent]
    });
    fixture = TestBed.createComponent(EmandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
