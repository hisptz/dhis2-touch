import { TestBed } from '@angular/core/testing';

import { SystemSettingService } from './system-setting.service';

describe('SystemSettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemSettingService = TestBed.get(SystemSettingService);
    expect(service).toBeTruthy();
  });
});
