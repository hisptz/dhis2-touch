import { TestBed } from '@angular/core/testing';

import { SmsCommandService } from './sms-command.service';

describe('SmsCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmsCommandService = TestBed.get(SmsCommandService);
    expect(service).toBeTruthy();
  });
});
