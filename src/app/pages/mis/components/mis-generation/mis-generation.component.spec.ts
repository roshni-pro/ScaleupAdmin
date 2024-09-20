import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisGenerationComponent } from './mis-generation.component';

describe('MisGenerationComponent', () => {
  let component: MisGenerationComponent;
  let fixture: ComponentFixture<MisGenerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MisGenerationComponent]
    });
    fixture = TestBed.createComponent(MisGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
