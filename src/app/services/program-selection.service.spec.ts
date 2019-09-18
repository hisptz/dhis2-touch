import { TestBed } from '@angular/core/testing';

import { ProgramSelectionService } from './program-selection.service';

describe('ProgramSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramSelectionService = TestBed.get(ProgramSelectionService);
    expect(service).toBeTruthy();
  });
});
