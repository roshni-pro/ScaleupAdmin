import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsaMasterComponent } from './dsa-master.component';

describe('DsaMasterComponent', () => {
  let component: DsaMasterComponent;
  let fixture: ComponentFixture<DsaMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DsaMasterComponent]
    });
    fixture = TestBed.createComponent(DsaMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
