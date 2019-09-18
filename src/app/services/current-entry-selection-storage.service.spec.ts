import { TestBed } from '@angular/core/testing';

import { CurrentEntrySelectionStorageService } from './current-entry-selection-storage.service';

describe('CurrentEntrySelectionStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentEntrySelectionStorageService = TestBed.get(CurrentEntrySelectionStorageService);
    expect(service).toBeTruthy();
  });
});
