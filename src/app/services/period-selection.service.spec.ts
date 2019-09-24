import { TestBed } from '@angular/core/testing';

import { PeriodSelectionService } from './period-selection.service';

describe('PeriodSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeriodSelectionService = TestBed.get(PeriodSelectionService);
    expect(service).toBeTruthy();
  });
});
