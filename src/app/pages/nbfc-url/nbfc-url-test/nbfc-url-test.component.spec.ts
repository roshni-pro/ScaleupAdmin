import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbfcUrlTestComponent } from './nbfc-url-test.component';

describe('NbfcUrlTestComponent', () => {
  let component: NbfcUrlTestComponent;
  let fixture: ComponentFixture<NbfcUrlTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NbfcUrlTestComponent]
    });
    fixture = TestBed.createComponent(NbfcUrlTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
