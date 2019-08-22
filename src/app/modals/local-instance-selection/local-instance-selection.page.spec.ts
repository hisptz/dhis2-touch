import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalInstanceSelectionPage } from './local-instance-selection.page';

describe('LocalInstanceSelectionPage', () => {
  let component: LocalInstanceSelectionPage;
  let fixture: ComponentFixture<LocalInstanceSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalInstanceSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalInstanceSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
