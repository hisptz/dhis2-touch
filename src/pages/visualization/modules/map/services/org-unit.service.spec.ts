import { TestBed, inject } from '@angular/core/testing';

import { OrgUnitService } from './org-unit.service';

describe('OrgUnitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgUnitService]
    });
  });

  it(
    'should be created',
    inject([OrgUnitService], (service: OrgUnitService) => {
      expect(service).toBeTruthy();
    })
  );
});
