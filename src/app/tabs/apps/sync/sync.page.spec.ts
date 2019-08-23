import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPage } from './sync.page';

describe('SyncPage', () => {
  let component: SyncPage;
  let fixture: ComponentFixture<SyncPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
