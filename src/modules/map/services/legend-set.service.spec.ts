import { TestBed, inject } from '@angular/core/testing';

import { LegendSetService } from './legend-set.service';

describe('LegendSetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LegendSetService]
    });
  });

  it('should be created', inject([LegendSetService], (service: LegendSetService) => {
    expect(service).toBeTruthy();
  }));
});
