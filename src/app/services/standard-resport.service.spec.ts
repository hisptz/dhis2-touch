import { TestBed } from '@angular/core/testing';

import { StandardResportService } from './standard-resport.service';

describe('StandardResportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StandardResportService = TestBed.get(StandardResportService);
    expect(service).toBeTruthy();
  });
});
