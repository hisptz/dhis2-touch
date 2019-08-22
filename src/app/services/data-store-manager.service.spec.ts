import { TestBed } from '@angular/core/testing';

import { DataStoreManagerService } from './data-store-manager.service';

describe('DataStoreManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataStoreManagerService = TestBed.get(DataStoreManagerService);
    expect(service).toBeTruthy();
  });
});
