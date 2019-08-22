import { TestBed } from '@angular/core/testing';

import { DataSetService } from './data-set.service';

describe('DataSetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSetService = TestBed.get(DataSetService);
    expect(service).toBeTruthy();
  });
});
