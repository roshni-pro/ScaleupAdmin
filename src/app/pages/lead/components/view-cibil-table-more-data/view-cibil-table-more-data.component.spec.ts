import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCibilTableMoreDataComponent } from './view-cibil-table-more-data.component';

describe('ViewCibilTableMoreDataComponent', () => {
  let component: ViewCibilTableMoreDataComponent;
  let fixture: ComponentFixture<ViewCibilTableMoreDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCibilTableMoreDataComponent]
    });
    fixture = TestBed.createComponent(ViewCibilTableMoreDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
