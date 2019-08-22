import { TestBed } from '@angular/core/testing';

import { LocalInstanceService } from './local-instance.service';

describe('LocalInstanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalInstanceService = TestBed.get(LocalInstanceService);
    expect(service).toBeTruthy();
  });
});
