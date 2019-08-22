import { TestBed } from '@angular/core/testing';

import { CategoryComboService } from './category-combo.service';

describe('CategoryComboService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryComboService = TestBed.get(CategoryComboService);
    expect(service).toBeTruthy();
  });
});
