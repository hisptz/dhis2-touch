import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitIntervalInputComponent } from './unit-interval-input.component';

describe('UnitIntervalInputComponent', () => {
  let component: UnitIntervalInputComponent;
  let fixture: ComponentFixture<UnitIntervalInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitIntervalInputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitIntervalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
