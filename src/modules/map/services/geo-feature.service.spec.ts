import { TestBed, inject } from '@angular/core/testing';

import { GeoFeatureService } from './geo-feature.service';

describe('GeoFeatureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoFeatureService]
    });
  });

  it(
    'should be created',
    inject([GeoFeatureService], (service: GeoFeatureService) => {
      expect(service).toBeTruthy();
    })
  );
});
