import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinateSelectionPage } from './coordinate-selection.page';

describe('CoordinateSelectionPage', () => {
  let component: CoordinateSelectionPage;
  let fixture: ComponentFixture<CoordinateSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinateSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinateSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
