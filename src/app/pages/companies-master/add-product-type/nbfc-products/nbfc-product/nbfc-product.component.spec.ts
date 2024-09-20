import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbfcProductComponent } from './nbfc-product.component';

describe('NbfcProductComponent', () => {
  let component: NbfcProductComponent;
  let fixture: ComponentFixture<NbfcProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NbfcProductComponent]
    });
    fixture = TestBed.createComponent(NbfcProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
