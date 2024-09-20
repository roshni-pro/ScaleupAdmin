import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnchorBusinessloanComponent } from './anchor-businessloan.component';

describe('AnchorBusinessloanComponent', () => {
  let component: AnchorBusinessloanComponent;
  let fixture: ComponentFixture<AnchorBusinessloanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnchorBusinessloanComponent]
    });
    fixture = TestBed.createComponent(AnchorBusinessloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
