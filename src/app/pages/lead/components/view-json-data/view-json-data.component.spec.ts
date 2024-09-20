import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJsonDataComponent } from './view-json-data.component';

describe('ViewJsonDataComponent', () => {
  let component: ViewJsonDataComponent;
  let fixture: ComponentFixture<ViewJsonDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewJsonDataComponent]
    });
    fixture = TestBed.createComponent(ViewJsonDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
