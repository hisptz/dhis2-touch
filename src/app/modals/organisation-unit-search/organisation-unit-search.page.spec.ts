import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationUnitSearchPage } from './organisation-unit-search.page';

describe('OrganisationUnitSearchPage', () => {
  let component: OrganisationUnitSearchPage;
  let fixture: ComponentFixture<OrganisationUnitSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationUnitSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationUnitSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
