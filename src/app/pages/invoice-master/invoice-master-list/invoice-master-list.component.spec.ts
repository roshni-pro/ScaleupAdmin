import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceMasterListComponent } from './invoice-master-list.component';

describe('InvoiceMasterListComponent', () => {
  let component: InvoiceMasterListComponent;
  let fixture: ComponentFixture<InvoiceMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceMasterListComponent]
    });
    fixture = TestBed.createComponent(InvoiceMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
