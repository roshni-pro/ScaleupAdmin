import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlAccountListComponent } from './bl-account-list.component';

describe('BlAccountListComponent', () => {
  let component: BlAccountListComponent;
  let fixture: ComponentFixture<BlAccountListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlAccountListComponent]
    });
    fixture = TestBed.createComponent(BlAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
