import { TestBed } from '@angular/core/testing';

import { LoaderNewService } from './loader-new.service';

describe('LoaderNewService', () => {
  let service: LoaderNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
