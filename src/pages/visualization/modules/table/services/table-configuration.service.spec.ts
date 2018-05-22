import { TestBed, inject } from '@angular/core/testing';

import { TableConfigurationService } from './table-configuration.service';

describe('TableConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableConfigurationService]
    });
  });

  it('should be created', inject([TableConfigurationService], (service: TableConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
