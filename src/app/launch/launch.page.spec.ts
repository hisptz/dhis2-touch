import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchPage } from './launch.page';

describe('LaunchPage', () => {
  let component: LaunchPage;
  let fixture: ComponentFixture<LaunchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
