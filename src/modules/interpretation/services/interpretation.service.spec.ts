import { TestBed, inject } from '@angular/core/testing';

import { InterpretationService } from './interpretation.service';

describe('InterpretationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterpretationService]
    });
  });

  it('should be created', inject([InterpretationService], (service: InterpretationService) => {
    expect(service).toBeTruthy();
  }));
});
