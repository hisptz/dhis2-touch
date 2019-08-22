import { TestBed } from '@angular/core/testing';

import { AppTransalationsService } from './app-transalations.service';

describe('AppTransalationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppTransalationsService = TestBed.get(AppTransalationsService);
    expect(service).toBeTruthy();
  });
});
