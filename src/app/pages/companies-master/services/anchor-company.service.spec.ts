import { TestBed } from '@angular/core/testing';

import { AnchorCompanyService } from './anchor-company.service';

describe('AnchorCompanyService', () => {
  let service: AnchorCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnchorCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
