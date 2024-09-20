import { TestBed } from '@angular/core/testing';

import { PermissionModeService } from './permission-mode.service';

describe('PermissionModeService', () => {
  let service: PermissionModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
