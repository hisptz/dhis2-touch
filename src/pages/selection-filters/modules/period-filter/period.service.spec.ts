import { TestBed, inject } from '@angular/core/testing';

import { PeriodService } from './period.service';

describe('PeriodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodService]
    });
  });

  it('should be created', inject([PeriodService], (service: PeriodService) => {
    expect(service).toBeTruthy();
  }));
});
