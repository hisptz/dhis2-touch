import { TestBed } from '@angular/core/testing';

import { ProgramRuleEngineService } from './program-rule-engine.service';

describe('ProgramRuleEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramRuleEngineService = TestBed.get(ProgramRuleEngineService);
    expect(service).toBeTruthy();
  });
});
