import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryFormPage } from './data-entry-form.page';

describe('DataEntryFormPage', () => {
  let component: DataEntryFormPage;
  let fixture: ComponentFixture<DataEntryFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataEntryFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
