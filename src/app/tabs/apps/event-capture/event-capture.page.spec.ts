import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCapturePage } from './event-capture.page';

describe('EventCapturePage', () => {
  let component: EventCapturePage;
  let fixture: ComponentFixture<EventCapturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCapturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCapturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
