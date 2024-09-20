import { TestBed } from '@angular/core/testing';

import { NbfcTestService } from './nbfc-test.service';

describe('NbfcTestService', () => {
  let service: NbfcTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NbfcTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
