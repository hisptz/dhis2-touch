import { TestBed } from '@angular/core/testing';

import { ValidationRuleService } from './validation-rule.service';

describe('ValidationRuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidationRuleService = TestBed.get(ValidationRuleService);
    expect(service).toBeTruthy();
  });
});
