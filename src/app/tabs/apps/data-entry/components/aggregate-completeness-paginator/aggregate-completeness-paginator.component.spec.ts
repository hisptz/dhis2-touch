import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregateCompletenessPaginatorComponent } from './aggregate-completeness-paginator.component';

describe('AggregateCompletenessPaginatorComponent', () => {
  let component: AggregateCompletenessPaginatorComponent;
  let fixture: ComponentFixture<AggregateCompletenessPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregateCompletenessPaginatorComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregateCompletenessPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
