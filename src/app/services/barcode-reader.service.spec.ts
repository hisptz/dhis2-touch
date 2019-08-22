import { TestBed } from '@angular/core/testing';

import { BarcodeReaderService } from './barcode-reader.service';

describe('BarcodeReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarcodeReaderService = TestBed.get(BarcodeReaderService);
    expect(service).toBeTruthy();
  });
});
