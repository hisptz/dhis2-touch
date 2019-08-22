import { TestBed } from '@angular/core/testing';

import { AppColorService } from './app-color.service';

describe('AppColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppColorService = TestBed.get(AppColorService);
    expect(service).toBeTruthy();
  });
});
