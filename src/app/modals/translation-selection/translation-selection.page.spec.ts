import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationSelectionPage } from './translation-selection.page';

describe('TranslationSelectionPage', () => {
  let component: TranslationSelectionPage;
  let fixture: ComponentFixture<TranslationSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
