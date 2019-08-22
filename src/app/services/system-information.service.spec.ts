import { TestBed } from '@angular/core/testing';

import { SystemInformationService } from './system-information.service';

describe('SystemInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemInformationService = TestBed.get(SystemInformationService);
    expect(service).toBeTruthy();
  });
});
