import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpretationListComponent } from './interpretation-list.component';

describe('InterpretationListComponent', () => {
  let component: InterpretationListComponent;
  let fixture: ComponentFixture<InterpretationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterpretationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpretationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
