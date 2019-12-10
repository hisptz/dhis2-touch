import { TestBed } from '@angular/core/testing';

import { DataEntryFormService } from './data-entry-form.service';

describe('DataEntryFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataEntryFormService = TestBed.get(DataEntryFormService);
    expect(service).toBeTruthy();
  });
});
