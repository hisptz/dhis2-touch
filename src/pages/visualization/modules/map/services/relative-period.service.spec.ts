import { TestBed, inject } from '@angular/core/testing';

import { RelativePeriodService } from './relative-period.service';

describe('RelativePeriodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelativePeriodService]
    });
  });

  it(
    'should be created',
    inject([RelativePeriodService], (service: RelativePeriodService) => {
      expect(service).toBeTruthy();
    })
  );
});
