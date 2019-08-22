import { TestBed } from '@angular/core/testing';

import { UserAuthorizationService } from './user-authorization.service';

describe('UserAuthorizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAuthorizationService = TestBed.get(UserAuthorizationService);
    expect(service).toBeTruthy();
  });
});
