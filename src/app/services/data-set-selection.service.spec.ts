import { TestBed } from '@angular/core/testing';

import { DataSetSelectionService } from './data-set-selection.service';

describe('DataSetSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSetSelectionService = TestBed.get(DataSetSelectionService);
    expect(service).toBeTruthy();
  });
});
