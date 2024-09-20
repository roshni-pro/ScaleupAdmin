import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDocComponent } from './invoice-doc.component';

describe('InvoiceDocComponent', () => {
  let component: InvoiceDocComponent;
  let fixture: ComponentFixture<InvoiceDocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceDocComponent]
    });
    fixture = TestBed.createComponent(InvoiceDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
