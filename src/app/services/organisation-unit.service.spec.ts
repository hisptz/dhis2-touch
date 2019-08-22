import { TestBed } from '@angular/core/testing';

import { OrganisationUnitService } from './organisation-unit.service';

describe('OrganisationUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganisationUnitService = TestBed.get(OrganisationUnitService);
    expect(service).toBeTruthy();
  });
});
