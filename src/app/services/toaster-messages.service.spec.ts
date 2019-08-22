import { TestBed } from '@angular/core/testing';

import { ToasterMessagesService } from './toaster-messages.service';

describe('ToasterMessagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToasterMessagesService = TestBed.get(ToasterMessagesService);
    expect(service).toBeTruthy();
  });
});
