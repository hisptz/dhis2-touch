import { TestBed } from '@angular/core/testing';

import { ProgramStageSectionService } from './program-stage-section.service';

describe('ProgramStageSectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramStageSectionService = TestBed.get(ProgramStageSectionService);
    expect(service).toBeTruthy();
  });
});
