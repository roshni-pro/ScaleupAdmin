import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFailComponent } from './invoice-fail.component';

describe('InvoiceFailComponent', () => {
  let component: InvoiceFailComponent;
  let fixture: ComponentFixture<InvoiceFailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceFailComponent]
    });
    fixture = TestBed.createComponent(InvoiceFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
