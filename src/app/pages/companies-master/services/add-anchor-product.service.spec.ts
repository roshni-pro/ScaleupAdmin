import { TestBed } from '@angular/core/testing';

import { AddAnchorProductService } from './add-anchor-product.service';

describe('AddAnchorProductService', () => {
  let service: AddAnchorProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAnchorProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
