import { TestBed, inject } from '@angular/core/testing';

import { ChartConfigurationService } from './chart-configuration.service';

describe('ChartConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartConfigurationService]
    });
  });

  it('should be created', inject([ChartConfigurationService], (service: ChartConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
