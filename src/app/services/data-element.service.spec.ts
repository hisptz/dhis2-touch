import { TestBed } from '@angular/core/testing';

import { DataElementService } from './data-element.service';

describe('DataElementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataElementService = TestBed.get(DataElementService);
    expect(service).toBeTruthy();
  });
});
