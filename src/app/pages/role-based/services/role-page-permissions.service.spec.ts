import { TestBed } from '@angular/core/testing';

import { RolePagePermissionsService } from './role-page-permissions.service';

describe('RolePagePermissionsService', () => {
  let service: RolePagePermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolePagePermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
